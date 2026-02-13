using GameStore.Api.Endpoints;
using Microsoft.EntityFrameworkCore;
using GameStore.Api.Data;

var builder = WebApplication.CreateBuilder(args);

var provider = builder.Configuration.GetValue<string>("DatabaseProvider") ?? "SqlServer";
string? connectionString = null;

if (provider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
{
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    }

    builder.Services.AddDbContext<GameStoreContext>(options =>
        options.UseSqlServer(connectionString, sql => sql.EnableRetryOnFailure()));
}
else if (provider.Equals("Sqlite", StringComparison.OrdinalIgnoreCase))
{
    connectionString = builder.Configuration.GetConnectionString("SqliteConnection") ?? "Data Source=GameStore.db";
    builder.Services.AddDbContext<GameStoreContext>(options =>
        options.UseSqlite(connectionString));
}

builder.Services.AddValidation();
builder.Services.AddCors();

var app = builder.Build();

// Apply migrations and seed data at startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<GameStoreContext>();
    if (provider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
    {
        db.Database.Migrate();
        // Seed data to ensure endpoints return content
        DbSeeder.SeedAsync(db).GetAwaiter().GetResult();
    }
    else
    {
        db.Database.EnsureCreated();
    }
}

app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.MapGamesEndpoints();
app.MapGenresEndpoints();

app.Run();