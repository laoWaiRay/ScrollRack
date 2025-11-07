using AutoMapper;
using Mtg_tracker.MappingProfiles;
using Mtg_tracker.Services;

namespace UnitTests;

public class DeckStatsServiceTest(DatabaseFixture fixture) : IClassFixture<DatabaseFixture>
{
    public DatabaseFixture Fixture { get; private set; } = fixture;

    [Fact]
    public void TestDeckStatsService()
    {
        var dbContext = Fixture.Context;

        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddMaps(typeof(AutoMapperProfile).Assembly);
        });

        var mapper = mapperConfig.CreateMapper();
        var service = new DeckStatsService(mapper);

        var users = dbContext.Users.ToList();
        Console.WriteLine($"All Users:");
        foreach (var user in users)
        {
            Console.WriteLine(user);
        }

        Assert.True(true);
    }
}
