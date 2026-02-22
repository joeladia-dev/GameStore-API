using System.Net;
using System.Net.Http.Json;
using GameStore.Api.Dtos;

namespace GameStore.Api.Tests.Tests;

public class GenresGetEndpointsTests
{
    [Fact]
    public async Task GetGenres_WhenSeedDataExists_ThenReturnsOkWithGenres()
    {
        using var factory = new GameStoreApiFactory();
        await factory.SeedBaselineDataAsync();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/genres");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var genres = await response.Content.ReadFromJsonAsync<List<GenreDto>>();
        Assert.NotNull(genres);
        Assert.NotEmpty(genres);
        Assert.Contains(genres, genre => genre.Name == "Action");
    }
}