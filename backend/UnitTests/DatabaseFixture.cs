using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Testcontainers.PostgreSql;

namespace UnitTests;

public sealed class DatabaseFixture : IAsyncLifetime
{
    private const string DbDockerImage = "postgres:17";
    public PostgreSqlContainer Container { get; private set; } = null!;
    public MtgContext Context { get; private set; } = null!;

    public async ValueTask DisposeAsync()
    {
        if (Container != null)
        {
            await Container.DisposeAsync();
        }
    }

    public async ValueTask InitializeAsync()
    {
        Container = new PostgreSqlBuilder().WithImage(DbDockerImage).Build();
        await Container.StartAsync(TestContext.Current.CancellationToken);

        var options = new DbContextOptionsBuilder<MtgContext>()
            .UseNpgsql(Container.GetConnectionString())
            .UseSnakeCaseNamingConvention()
            .Options;

        Context = new MtgContext(options);
        await Context.Database.EnsureCreatedAsync();

        // Seed initial db data here
        await SeedDb(Context);
    }

    private static async Task SeedDb(MtgContext context)
    {
        var user1 = new ApplicationUser { UserName = "user1", Email = "user1@gmail.com" };
        var user2 = new ApplicationUser { UserName = "user2", Email = "user2@gmail.com" };
        var user3 = new ApplicationUser { UserName = "user3", Email = "user3@gmail.com" };

        context.Users.AddRange([user1, user2, user3]);
        await context.SaveChangesAsync();
    }
}
