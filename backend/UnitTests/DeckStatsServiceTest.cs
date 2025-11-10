using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.MappingProfiles;
using Mtg_tracker.Models;
using Mtg_tracker.Services;

namespace UnitTests;

public class DeckStatsServiceTest : IClassFixture<DatabaseFixture>
{
    public DatabaseFixture Fixture { get; private set; }
    public DeckStatsService DeckStatsService { get; private set; }

    public DeckStatsServiceTest(DatabaseFixture fixture)
    {
        Fixture = fixture;
        var mapper = Fixture.MapperConfig.CreateMapper();
        DeckStatsService = new DeckStatsService(mapper);
    }

    [Fact]
    public void ComputesDeckStats()
    {
        // Arrange
        using var db = Fixture.CreateContext();
        var users = db
            .Users.Include(u => u.Decks)
            .Include(u => u.GameParticipations)
            .ThenInclude(gp => gp.Game)
            .ToList();

        // Act
        var user0 = users.Single(u => u.UserName == "user0");
        var user0Deck0Gps = user0
            .GameParticipations.Where(gp => gp.DeckId == user0.Decks[0].Id)
            .ToList();
        var deckReadDTO = DeckStatsService.ComputeDeckStats(user0Deck0Gps, user0.Decks[0]);

        // Assert
        Assert.NotNull(deckReadDTO.Statistics);
        Assert.Equal(DeckStatsService.PodSizeConstraints.Count, deckReadDTO.Statistics.Count);

        // Check per deck stats per pod size
        var allPodsDeckStats = deckReadDTO.Statistics.Single(s => s.PodSize == 0).Stats;
        var twoPlayerPodDeckStats = deckReadDTO.Statistics.Single(s => s.PodSize == 2).Stats;
        var threePlayerPodDeckStats = deckReadDTO.Statistics.Single(s => s.PodSize == 3).Stats;

        Assert.Equal(4, allPodsDeckStats.NumGames);
        Assert.Equal(2, twoPlayerPodDeckStats.NumGames);
        Assert.Equal(2, threePlayerPodDeckStats.NumGames);

        Assert.Equal(3, allPodsDeckStats.NumWins);
        Assert.Equal(1, twoPlayerPodDeckStats.NumWins);
        Assert.Equal(2, threePlayerPodDeckStats.NumWins);

        Assert.Equal(1, allPodsDeckStats.CurrentStreak);
        Assert.Equal(1, twoPlayerPodDeckStats.CurrentStreak);
        Assert.Equal(2, threePlayerPodDeckStats.CurrentStreak);

        Assert.False(allPodsDeckStats.IsCurrentWinStreak);
        Assert.False(twoPlayerPodDeckStats.IsCurrentWinStreak);
        Assert.True(threePlayerPodDeckStats.IsCurrentWinStreak);

        Assert.Equal(3, allPodsDeckStats.LongestWinStreak);
        Assert.Equal(1, twoPlayerPodDeckStats.LongestWinStreak);
        Assert.Equal(2, threePlayerPodDeckStats.LongestWinStreak);

        Assert.Equal(500, allPodsDeckStats.FastestWinInSeconds);
        Assert.Equal(500, twoPlayerPodDeckStats.FastestWinInSeconds);
        Assert.Equal(800, threePlayerPodDeckStats.FastestWinInSeconds);

        Assert.Equal(1000, allPodsDeckStats.SlowestWinInSeconds);
        Assert.Equal(500, twoPlayerPodDeckStats.SlowestWinInSeconds);
        Assert.Equal(1000, threePlayerPodDeckStats.SlowestWinInSeconds);

        Assert.Equal(
            user0Deck0Gps.MaxBy(gp => gp.CreatedAt)?.CreatedAt,
            allPodsDeckStats.LastPlayed
        );
    }
}
