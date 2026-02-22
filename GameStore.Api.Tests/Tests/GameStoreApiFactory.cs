using GameStore.Api.Data;
using GameStore.Api.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GameStore.Api.Tests.Tests;

public sealed class GameStoreApiFactory : WebApplicationFactory<Program>
{
    private readonly string _sqlitePath = Path.Combine(Path.GetTempPath(), $"gamestore-tests-{Guid.NewGuid():N}.db");

    public GameStoreApiFactory()
    {
        Environment.SetEnvironmentVariable("DatabaseProvider", "Sqlite");
        Environment.SetEnvironmentVariable("ConnectionStrings__SqliteConnection", $"Data Source={_sqlitePath}");
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureAppConfiguration((_, configBuilder) =>
        {
            var settings = new Dictionary<string, string?>
            {
                ["DatabaseProvider"] = "Sqlite",
                ["ConnectionStrings:SqliteConnection"] = $"Data Source={_sqlitePath}"
            };

            configBuilder.AddInMemoryCollection(settings);
        });
    }

    public async Task SeedBaselineDataAsync()
    {
        using var scope = Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<GameStoreContext>();

        if (!await dbContext.Genres.AnyAsync())
        {
            await dbContext.Genres.AddRangeAsync(
                new Genre { Name = "Action" },
                new Genre { Name = "RPG" },
                new Genre { Name = "Strategy" });
            await dbContext.SaveChangesAsync();
        }

        if (!await dbContext.Games.AnyAsync())
        {
            var actionGenreId = await dbContext.Genres
                .Where(genre => genre.Name == "Action")
                .Select(genre => genre.Id)
                .FirstAsync();

            await dbContext.Games.AddAsync(new Game
            {
                Name = "Halo",
                GenreId = actionGenreId,
                Price = 59.99m,
                ReleaseDate = new DateOnly(2001, 11, 15)
            });
            await dbContext.SaveChangesAsync();
        }
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);

        if (!disposing)
        {
            return;
        }

        try
        {
            Environment.SetEnvironmentVariable("DatabaseProvider", null);
            Environment.SetEnvironmentVariable("ConnectionStrings__SqliteConnection", null);

            if (File.Exists(_sqlitePath))
            {
                File.Delete(_sqlitePath);
            }
        }
        catch
        {
        }
    }
}