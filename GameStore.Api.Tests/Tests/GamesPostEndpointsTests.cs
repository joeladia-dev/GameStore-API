using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using GameStore.Api.Dtos;

namespace GameStore.Api.Tests.Tests;

public class GamesPostEndpointsTests
{
    [Fact]
    public async Task PostGame_WhenPayloadIsValid_ThenReturnsCreated()
    {
        using var factory = new GameStoreApiFactory();
        await factory.SeedBaselineDataAsync();
        var client = factory.CreateClient();

        var genres = await client.GetFromJsonAsync<List<GenreDto>>("/genres");
        var genreId = genres!.First().Id;

        var newGame = new CreateGameDto(
            Name: "Forza",
            GenreId: genreId,
            Price: 49.99m,
            ReleaseDate: new DateOnly(2023, 10, 10));

        var response = await client.PostAsJsonAsync("/games", newGame);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.NotNull(response.Headers.Location);

        var body = await response.Content.ReadFromJsonAsync<GameDetailsDto>();
        Assert.NotNull(body);
        Assert.Equal("Forza", body.Name);
        Assert.Equal(genreId, body.GenreId);
    }

    [Fact]
    public async Task PostGame_WhenPayloadIsInvalid_ThenReturnsBadRequest()
    {
        using var factory = new GameStoreApiFactory();
        await factory.SeedBaselineDataAsync();
        var client = factory.CreateClient();

        var invalidPayload = new
        {
            Name = "",
            GenreId = 0,
            Price = 0,
            ReleaseDate = new DateOnly(2023, 10, 10)
        };

        var response = await client.PostAsJsonAsync("/games", invalidPayload);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        using var validationResult = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.True(validationResult.RootElement.ValueKind is JsonValueKind.Object or JsonValueKind.Array);
    }
}