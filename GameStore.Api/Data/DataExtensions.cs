using GameStore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Data;

public static class DataExtensions
{
    // Runs migrations at startup
    public static void MigrateDb(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<GameStoreContext>();
        dbContext.Database.Migrate();
    }

    // Adds DbContext for SQL Server
    public static void AddGameStoreDb(this WebApplicationBuilder builder)
    {
        // Use the connection string named "GameStore" from appsettings or Azure App Service
        var connString = builder.Configuration.GetConnectionString("GameStore");

        builder.Services.AddDbContext<GameStoreContext>(options =>
            options.UseSqlServer(connString)  // <-- switch from SQLite to SQL Server
                   .UseSeeding((context, _) =>
                   {
                       // Seed genres if table is empty
                       if (!context.Set<Genre>().Any())
                       {
                           context.Set<Genre>().AddRange(
                               new Genre { Name = "Action" },
                               new Genre { Name = "Adventure" },
                               new Genre { Name = "RPG" },
                               new Genre { Name = "Strategy" },
                               new Genre { Name = "Simulation" }
                           );
                           context.SaveChanges();
                       }
                   })
        );
    }
}
