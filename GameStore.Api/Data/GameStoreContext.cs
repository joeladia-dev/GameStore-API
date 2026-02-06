using GameStore.Api.Models;
using Microsoft.EntityFrameworkCore;

public class GameStoreContext : DbContext
{
    public GameStoreContext(DbContextOptions<GameStoreContext> options)
        : base(options)
    {
    }

    public DbSet<Game> Games => Set<Game>();
    public DbSet<Genre> Genres => Set<Genre>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>()
            .Property(g => g.Price)
            .HasPrecision(18, 2);

        base.OnModelCreating(modelBuilder);
    }
}

