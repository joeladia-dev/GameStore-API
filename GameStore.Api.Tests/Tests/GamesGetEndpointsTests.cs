using System.Net;
using System.Net.Http.Json;
using GameStore.Api.Dtos;

namespace GameStore.Api.Tests.Tests;

public class GamesGetEndpointsTests
{
    [Fact]
    public async Task GetGames_WhenSeedDataExists_ThenReturnsOkWithGames()
    {
        using var factory = new GameStoreApiFactory();
        await factory.SeedBaselineDataAsync();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/games");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var games = await response.Content.ReadFromJsonAsync<List<GameSummaryDto>>();
        Assert.NotNull(games);
        Assert.NotEmpty(games);
        Assert.Contains(games, game => game.Name == "Halo");
    }

    [Fact]
    public async Task GetGameById_WhenGameDoesNotExist_ThenReturnsNotFound()
    {
        using var factory = new GameStoreApiFactory();
        await factory.SeedBaselineDataAsync();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/games/99999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}