using AutoMapper;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;

namespace Mtg_tracker.Services;

public record StreakStats(int CurrentStreak, bool? IsCurrentWinStreak, int LongestWinStreak, int LongestLossStreak);
public record PodSizeConstraint(int Min, int Max);

public class DeckStatsService(IMapper mapper)
{
    private readonly IMapper _mapper = mapper;

    public List<PodSizeConstraint> PodSizeConstraints = [
        new PodSizeConstraint(2, 2),
        new PodSizeConstraint(3, 3),
        new PodSizeConstraint(4, 4),
        new PodSizeConstraint(5, int.MaxValue),
        new PodSizeConstraint(0, int.MaxValue),
    ];

    public double ComputePar(List<GameParticipation> gameParticipations)
    {
        if (gameParticipations.Count == 0)
        {
            return 0.0;
        }

        var parsByPodSize = gameParticipations
            .GroupBy(gp => gp.Game.NumPlayers)
            .Select(group => 1.0 / group.Key * group.Count());

        double par = 0.0;
        if (parsByPodSize != null && gameParticipations != null)
        {
            par = parsByPodSize.Aggregate(0.0, (current, next) => current + next);
            if (gameParticipations.Count > 0)
                par /= gameParticipations.Count;
            else
                par = 0.0;
        }

        return par;
    }

    public StreakStats ComputeStreakStats(List<GameParticipation> gameParticipations)
    {
        var isWinStreak = gameParticipations.FirstOrDefault()?.Won;

        var streak = gameParticipations
            .TakeWhile(gp => gp.Won == isWinStreak && !gp.Game.Imported)
            .Count();

        int currWinStreak = 0;
        int currLossStreak = 0;
        int longestWinStreak = 0;
        int longestLossStreak = 0;
        foreach (var gp in gameParticipations)
        {
            currWinStreak = gp.Won ? currWinStreak + 1 : 0;
            currLossStreak = !gp.Won ? currLossStreak + 1 : 0;
            longestWinStreak = Math.Max(currWinStreak, longestWinStreak);
            longestLossStreak = Math.Max(currLossStreak, longestLossStreak);
        }

        return new StreakStats(
            streak,
            isWinStreak,
            longestWinStreak,
            longestLossStreak
        );
    }

    public DeckReadDTO ComputeDeckStats(List<GameParticipation> deckGameParticipations, Deck deck)
    {
        List<FilteredDeckStats> filteredDeckStats = [];
        foreach (var podSize in PodSizeConstraints)
        {
            List<GameParticipation> filteredGameParticipations = deckGameParticipations
                .Where(gp => gp.Game.NumPlayers >= podSize.Min && gp.Game.NumPlayers <= podSize.Max)
                .ToList();

            var streakStats = ComputeStreakStats(filteredGameParticipations);

            var winningGameLengths = filteredGameParticipations
                .Where(gp => gp.Won)
                .Select(gp => gp.Game.Seconds)
                .ToList();

            var fastestWinInSeconds = winningGameLengths.Count > 0 ? winningGameLengths.Min() : 0;
            var slowestWinInSeconds = winningGameLengths.Count > 0 ? winningGameLengths.Max() : 0;

            double par = ComputePar(filteredGameParticipations);

            var latestWin = filteredGameParticipations.Where(gp => gp.Won && !gp.Game.Imported).FirstOrDefault()?.CreatedAt;

            DeckStats deckStats = new()
            {
                NumGames = filteredGameParticipations.Count,
                NumWins = filteredGameParticipations.Where(gp => gp.Won).Count(),
                LatestWin = latestWin,
                CurrentStreak = streakStats.CurrentStreak,
                IsCurrentWinStreak = streakStats.IsCurrentWinStreak,
                LongestWinStreak = streakStats.LongestWinStreak,
                LongestLossStreak = streakStats.LongestLossStreak,
                FastestWinInSeconds = fastestWinInSeconds,
                SlowestWinInSeconds = slowestWinInSeconds,
                Par = par,
            };
            FilteredDeckStats filteredStats = new()
            {
                PodSize = podSize.Min,
                Stats = deckStats,
            };
            filteredDeckStats.Add(filteredStats);
        }

        DeckReadDTO deckReadDTO = _mapper.Map<DeckReadDTO>(deck);
        deckReadDTO.Statistics = filteredDeckStats;

        return deckReadDTO;
    }

    // Groups games/wins/losses by time period for displaying on Line Chart
    public List<WinLossGameCount> ComputeWinLossGameCounts(List<GameParticipation> gameParticipations)
    {
        int bucketCount = 12;

        var firstDate = gameParticipations.Last().CreatedAt;
        var lastDate = gameParticipations.First().CreatedAt;
        var totalSpan = lastDate - firstDate;
        var bucketSpan = TimeSpan.FromSeconds(totalSpan.TotalSeconds / bucketCount);

        var buckets = new List<WinLossGameCount>();
        for (int i = 0; i < bucketCount; i++)
        {
            var periodStart = firstDate.AddSeconds(i * bucketSpan.TotalSeconds);
            var periodEnd = (i == bucketCount - 1)
                ? lastDate
                : firstDate.AddSeconds((i + 1) * bucketSpan.TotalSeconds);

            buckets.Add(new WinLossGameCount()
            {
                PeriodStart = periodStart,
                PeriodEnd = periodEnd,
                Games = 0,
                Wins = 0,
                Losses = 0
            });
        }

        foreach (var gp in gameParticipations)
        {
            var offset = gp.CreatedAt - firstDate;
            var index = (int)(offset.TotalSeconds / bucketSpan.TotalSeconds);

            if (index >= bucketCount)
            {
                index = bucketCount - 1;
            }

            if (gp.Won)
            {
                buckets[index].Wins++;
            }
            else
            {
                buckets[index].Losses++;
            }
            buckets[index].Games++;
        }

        return buckets;
    }
}