using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.MappingProfiles;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;
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

        var user0 = users.Single(u => u.UserName == "user0");
        var user0Deck0Gps = user0
            .GameParticipations.Where(gp => gp.DeckId == user0.Decks[0].Id)
            .ToList();

        DeckStats expectedAllPods = new()
        {
            NumGames = 4,
            NumWins = 3,
            CurrentStreak = 1,
            IsCurrentWinStreak = false,
            LongestWinStreak = 3,
            LongestLossStreak = 1,
            FastestWinInSeconds = 500,
            SlowestWinInSeconds = 1000,
            Par = 0.42,
            LastPlayed = user0Deck0Gps.Select(gp => gp.CreatedAt).Max(),
            LatestWin = user0Deck0Gps.Where(gp => gp.Won).Select(gp => gp.CreatedAt).Max(),
        };

        DeckStats expectedTwoPlayerPods = new()
        {
            NumGames = 2,
            NumWins = 1,
            CurrentStreak = 1,
            IsCurrentWinStreak = false,
            LongestWinStreak = 1,
            LongestLossStreak = 1,
            FastestWinInSeconds = 500,
            SlowestWinInSeconds = 500,
            Par = 1.0 / 2,
            LastPlayed = user0Deck0Gps
                .Where(gp => gp.Game.NumPlayers == 2)
                .Select(gp => gp.CreatedAt)
                .Max(),
            LatestWin = user0Deck0Gps
                .Where(gp => gp.Game.NumPlayers == 2)
                .Where(gp => gp.Won)
                .Select(gp => gp.CreatedAt)
                .Max(),
        };

        DeckStats expectedThreePlayerPods = new()
        {
            NumGames = 2,
            NumWins = 2,
            CurrentStreak = 2,
            IsCurrentWinStreak = true,
            LongestWinStreak = 2,
            LongestLossStreak = 0,
            FastestWinInSeconds = 800,
            SlowestWinInSeconds = 1000,
            Par = 1.0 / 3,
            LastPlayed = user0Deck0Gps
                .Where(gp => gp.Game.NumPlayers == 3)
                .Select(gp => gp.CreatedAt)
                .Max(),
            LatestWin = user0Deck0Gps
                .Where(gp => gp.Game.NumPlayers == 3)
                .Where(gp => gp.Won)
                .Select(gp => gp.CreatedAt)
                .Max(),
        };

        // Act
        var deckReadDTO = DeckStatsService.ComputeDeckStats(user0Deck0Gps, user0.Decks[0]);

        // Assert
        Assert.NotNull(deckReadDTO.Statistics);
        Assert.Equal(DeckStatsService.PodSizeConstraints.Count, deckReadDTO.Statistics.Count);

        // Check per deck stats per pod size
        var allPodsDeckStats = deckReadDTO.Statistics.Single(s => s.PodSize == 0).Stats;
        var twoPlayerPodDeckStats = deckReadDTO.Statistics.Single(s => s.PodSize == 2).Stats;
        var threePlayerPodDeckStats = deckReadDTO.Statistics.Single(s => s.PodSize == 3).Stats;

        static void compare(DeckStats expected, DeckStats actual)
        {
            Assert.Equal(expected.NumGames, actual.NumGames);
            Assert.Equal(expected.NumWins, actual.NumWins);
            Assert.Equal(expected.CurrentStreak, actual.CurrentStreak);
            Assert.Equal(expected.IsCurrentWinStreak, actual.IsCurrentWinStreak);
            Assert.Equal(expected.LongestWinStreak, actual.LongestWinStreak);
            Assert.Equal(expected.LongestLossStreak, actual.LongestLossStreak);
            Assert.Equal(expected.FastestWinInSeconds, actual.FastestWinInSeconds);
            Assert.Equal(expected.SlowestWinInSeconds, actual.SlowestWinInSeconds);
            Assert.NotNull(expected.Par);
            Assert.NotNull(actual.Par);
            Assert.Equal(expected.Par.Value, actual.Par.Value, tolerance: 0.1);
            Assert.Equal(expected.LastPlayed, actual.LastPlayed);
            Assert.Equal(expected.LatestWin, actual.LatestWin);
        }

        compare(expectedAllPods, allPodsDeckStats);
        compare(expectedTwoPlayerPods, twoPlayerPodDeckStats);
        compare(expectedThreePlayerPods, threePlayerPodDeckStats);
    }

    [Fact]
    public void ComputesEmptyDeckStats()
    {
        // Arrange
        using var db = Fixture.CreateContext();
        var users = db
            .Users.Include(u => u.Decks)
            .Include(u => u.GameParticipations)
            .ThenInclude(gp => gp.Game)
            .ToList();

        var user0 = users.Single(u => u.UserName == "user0");

        DeckStats expected = new() { NumGames = 0, NumWins = 0 };

        // Act
        // Simulate a deck without any games
        DeckStats? stats = DeckStatsService
            .ComputeDeckStats([], user0.Decks[0])
            .Statistics?.Single(s => s.PodSize == 0)
            ?.Stats;

        // Assert
        Assert.NotNull(stats);
        Assert.Equal(expected.NumGames, stats.NumGames);
        Assert.Equal(expected.NumWins, stats.NumWins);
    }

    [Fact]
    public void ComputesPar()
    {
        // Arrange
        using var db = Fixture.CreateContext();
        var users = db
            .Users.Include(u => u.Decks)
            .Include(u => u.GameParticipations)
            .ThenInclude(gp => gp.Game)
            .ToList();

        // Act
        double ComputeParForUserAndDeck(string username, int deckIndex)
        {
            var user = users.Single(u => u.UserName == username);
            var userDeckGps = user
                .GameParticipations.Where(gp => gp.DeckId == user.Decks[deckIndex].Id)
                .ToList();

            return DeckStatsService.ComputePar(userDeckGps);
        }

        // Assert
        Assert.Equal(0.42, ComputeParForUserAndDeck("user0", 0), 2);
        Assert.Equal(0.42, ComputeParForUserAndDeck("user1", 0), 2);
        Assert.Equal(1.0 / 3, ComputeParForUserAndDeck("user2", 0), 2);
    }

    [Fact]
    public void ComputesEmptyPar()
    {
        Assert.Equal(0.0, DeckStatsService.ComputePar([]));
    }

    [Fact]
    public void ComputesStreakStats()
    {
        // Arrange
        using var db = Fixture.CreateContext();
        var users = db
            .Users.Include(u => u.Decks)
            .Include(u => u.GameParticipations)
            .ThenInclude(gp => gp.Game)
            .ToList();

        var user = users.Single(u => u.UserName == "user0");
        List<GameParticipation> gps = user
            .GameParticipations.Where(gp => gp.DeckId == user.Decks[0].Id)
            .ToList();

        // Act
        StreakStats streakStats = DeckStatsService.ComputeStreakStats(gps);

        // Assert
        Assert.Equal(1, streakStats.CurrentStreak);
        Assert.False(streakStats.IsCurrentWinStreak);
        Assert.Equal(3, streakStats.LongestWinStreak);
        Assert.Equal(1, streakStats.LongestLossStreak);
    }

    [Fact]
    public void ComputesEmptyStreakStats()
    {
        StreakStats emptyStats = DeckStatsService.ComputeStreakStats([]);
        Assert.Equal(0, emptyStats.CurrentStreak);
        Assert.Null(emptyStats.IsCurrentWinStreak);
        Assert.Equal(0, emptyStats.LongestWinStreak);
        Assert.Equal(0, emptyStats.LongestLossStreak);
    }

    [Fact]
    public void ComputesWinLossGameCounts()
    {
        // Arrange
        using var db = Fixture.CreateContext();
        var users = db
            .Users.Include(u => u.Decks)
            .Include(u => u.GameParticipations)
            .ThenInclude(gp => gp.Game)
            .ToList();

        var user = users.Single(u => u.UserName == "user0");
        List<GameParticipation> gps = user
            .GameParticipations.Where(gp => gp.DeckId == user.Decks[0].Id)
            .ToList();

        // Act
        List<WinLossGameCount> winLossCounts = DeckStatsService.ComputeWinLossGameCounts(gps);

        // Assert
        const int BUCKET_COUNT = 12;
        Assert.Equal(BUCKET_COUNT, winLossCounts.Count);

        int gameCount = winLossCounts.Select(data => data.Games).Sum();
        Assert.Equal(gps.Count, gameCount);

        int winCount = winLossCounts.Select(data => data.Wins).Sum();
        Assert.Equal(gps.Where(gp => gp.Won).Count(), winCount);

        int lossCount = winLossCounts.Select(data => data.Losses).Sum();
        Assert.Equal(gps.Where(gp => !gp.Won).Count(), lossCount);
    }
}
