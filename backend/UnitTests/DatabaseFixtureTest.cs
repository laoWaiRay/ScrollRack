using Microsoft.EntityFrameworkCore;

namespace UnitTests;

public class DatabaseFixtureTest(DatabaseFixture fixture) : IClassFixture<DatabaseFixture>
{
    public DatabaseFixture Fixture { get; private set; } = fixture;

    [Fact]
    public void TestDatabaseFixtureInitialization()
    {
        using var db = Fixture.CreateContext();

        // Check global counts
        Assert.Equal(3, db.Users.Count());
        Assert.Equal(3, db.Decks.Count());
        Assert.Equal(4, db.Games.Count());
        Assert.Equal(10, db.GameParticipations.Count());
        Assert.Empty(db.Rooms);

        var users = db.Users.Include(u => u.GameParticipations).Include(u => u.Decks).ToList();
        List<string> usernames = DatabaseFixture
            .SeedUserData.Select(data => data.UserName)
            .ToList();

        // Check deck counts per player
        Dictionary<string, int> expectedDeckCounts = new()
        {
            { usernames[0], 1 },
            { usernames[1], 1 },
            { usernames[2], 1 },
        };

        foreach (var (userName, expectedCount) in expectedDeckCounts)
        {
            var user = users.Single(u => u.UserName == userName);
            Assert.Equal(expectedCount, user.Decks.Count);
        }

        // Check game participations per player
        Dictionary<string, int> expectedParticipationCounts = new()
        {
            { usernames[0], 4 },
            { usernames[1], 4 },
            { usernames[2], 2 },
        };

        foreach (var (userName, expectedCount) in expectedParticipationCounts)
        {
            var user = users.Single(u => u.UserName == userName);
            Assert.Equal(expectedCount, user.GameParticipations.Count);
        }

        // Check correct win counts per player
        Dictionary<string, int> expectedWins = new()
        {
            { usernames[0], 3 },
            { usernames[1], 1 },
            { usernames[2], 0 },
        };

        foreach (var (userName, expectedCount) in expectedWins)
        {
            var user = users.Single(u => u.UserName == userName);
            Assert.Equal(expectedCount, user.GameParticipations.Where(gp => gp.Won).Count());
        }
    }
}
