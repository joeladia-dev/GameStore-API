using System.Net;
using System.Net.Http.Json;
using GameStore.Api.Dtos;

namespace GameStore.Api.Tests.Tests;

public class GamesPutDeleteEndpointsTests
{
    [Fact]
    public async Task PutGame_WhenGameExists_ThenReturnsNoContentAndUpdatesGame()
    {
        using var factory = new GameStoreApiFactory();
        await factory.SeedBaselineDataAsync();
        var client = factory.CreateClient();

        var games = await client.GetFromJsonAsync<List<GameSummaryDto>>("/games");
        var gameId = games!.First().Id;

        var genres = await client.GetFromJsonAsync<List<GenreDto>>("/genres");
        var targetGenreId = genres!.Last().Id;

        var update = new UpdateGameDto(
            Name: "Halo Infinite",
            GenreId: targetGenreId,
            Price: 69.99m,
            ReleaseDate: new DateOnly(2021, 12, 8));

        var putResponse = await client.PutAsJsonAsync($"/games/{gameId}", update);

        Assert.Equal(HttpStatusCode.NoContent, putResponse.StatusCode);

        var getResponse = await client.GetAsync($"/games/{gameId}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
        var updatedGame = await getResponse.Content.ReadFromJsonAsync<GameDetailsDto>();

        Assert.NotNull(updatedGame);
        Assert.Equal("Halo Infinite", updatedGame.Name);
        Assert.Equal(targetGenreId, updatedGame.GenreId);
        Assert.Equal(69.99m, updatedGame.Price);
    }

    [Fact]
    public async Task PutGame_WhenGameDoesNotExist_ThenReturnsNotFound()
    {
        using var factory = new GameStoreApiFactory();
        await factory.SeedBaselineDataAsync();
        var client = factory.CreateClient();

        var genres = await client.GetFromJsonAsync<List<GenreDto>>("/genres");
        var update = new UpdateGameDto(
            Name: "Ghost Game",
            GenreId: genres!.First().Id,
            Price: 29.99m,
            ReleaseDate: new DateOnly(2024, 1, 1));

        var response = await client.PutAsJsonAsync("/games/99999", update);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeleteGame_WhenGameExists_ThenReturnsNoContentAndRemovesGame()
    {
        using var factory = new GameStoreApiFactory();
        await factory.SeedBaselineDataAsync();
        var client = factory.CreateClient();

        var genres = await client.GetFromJsonAsync<List<GenreDto>>("/genres");
        var create = new CreateGameDto(
            Name: "Temp Game",
            GenreId: genres!.First().Id,
            Price: 9.99m,
            ReleaseDate: new DateOnly(2025, 1, 1));

        var createResponse = await client.PostAsJsonAsync("/games", create);
        var createdGame = await createResponse.Content.ReadFromJsonAsync<GameDetailsDto>();

        var deleteResponse = await client.DeleteAsync($"/games/{createdGame!.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        var getResponse = await client.GetAsync($"/games/{createdGame.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }
}