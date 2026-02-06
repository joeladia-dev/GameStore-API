using GameStore.Api.Models;
using GameStore.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(GameStoreContext context)
    {
        // Check if Genres already exist
        if (!context.Genres.Any())
        {
            var genres = new List<Genre>
            {
                new Genre { Name = "Action" },
                new Genre { Name = "Adventure" },
                new Genre { Name = "RPG" },
                new Genre { Name = "Strategy" },
                new Genre { Name = "Sports" }
            };

            context.Genres.AddRange(genres);
            await context.SaveChangesAsync();
        }

        // Check if Games already exist
        if (!context.Games.Any())
        {
            var actionGenre = context.Genres.First(g => g.Name == "Action");
            var rpgGenre = context.Genres.First(g => g.Name == "RPG");

            var games = new List<Game>
            {
                new Game
                {
                    Name = "Super Action Game",
                    Price = 49.99m,
                    GenreId = actionGenre.Id,
                    ReleaseDate = new DateOnly(2023, 5, 1)
                },
                new Game
                {
                    Name = "Epic RPG Quest",
                    Price = 59.99m,
                    GenreId = rpgGenre.Id,
                    ReleaseDate = new DateOnly(2012, 1, 12)
                },
                new Game
                {
                    Name = "Counter-Strike: Global Offensive",
                    Price = 39.99m,
                    GenreId = actionGenre.Id,
                    ReleaseDate = new DateOnly(2016, 12, 9)
                }
            };


            context.Games.AddRange(games);
            await context.SaveChangesAsync();
        }
    }
}
