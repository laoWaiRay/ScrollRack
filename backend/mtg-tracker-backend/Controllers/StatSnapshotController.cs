using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;
using Mtg_tracker.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;
using Mtg_tracker.Services;

namespace Mtg_tracker.Controllers;

public record PodSizeConstraint(int Min, int Max);

[Route("api/[controller]")]
[ApiController]
public class StatSnapshotController(MtgContext context, IMapper mapper, DeckStatsService deckStatsService) : ControllerBase
{
    private readonly MtgContext _context = context;
    private readonly IMapper _mapper = mapper;
    private readonly DeckStatsService _deckStatsService = deckStatsService;

    // Returns all-time, year, and month stat snapshots for the current user
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<FilteredStatSnapshotDTO>>> GetStatSnapshot()
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(u => u.StatSnapshot)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
        {
            return Unauthorized();
        }

        if (user.StatSnapshot is null)
        {
            return NotFound();
        }

        var gameParticipations = await _context.GameParticipations
            .Include(gp => gp.Game)
            .Include(gp => gp.Deck)
            .Where(gp => gp.UserId == userId)
            .OrderByDescending(gp => gp.CreatedAt)
            .ToListAsync();

        var decks = await _context.Decks
            .Where(d => d.UserId == userId)
            .ToListAsync();

        // All other statistics are computed for each time period (All-time, Current Year, Current Month)
        // and for each pod size (2, 3, 4, or 5+)
        DateTime now = DateTime.Now;
        DateTime[] periodStartTimes = [
            new DateTime(2000, 1, 1),
            new DateTime(now.Year, 1, 1),
            new DateTime(now.Year, now.Month, 1),
        ];

        string[] periodLabels = [
            "AllTime",
            "CurrentYear",
            "CurrentMonth",
        ];

        var periodStartTimeToLabel = periodStartTimes
            .Select((startTime, i) => new { startTime, label = periodLabels[i] })
            .ToDictionary(x => x.startTime, x => x.label);

        // (min, max) number of players in game
        List<PodSizeConstraint> podSizeConstraints = [
            new PodSizeConstraint(2, 2),
            new PodSizeConstraint(3, 3),
            new PodSizeConstraint(4, 4),
            new PodSizeConstraint(5, int.MaxValue),
            new PodSizeConstraint(0, int.MaxValue),
        ];

        List<FilteredStatSnapshotDTO> filteredSnapshotDTOs = [];

        foreach (var podSize in podSizeConstraints)
        {
            foreach (DateTime startTime in periodStartTimes)
            {
                var filteredGameParticipations = gameParticipations
                    .Where(gp => gp.CreatedAt >= startTime)
                    .Where(gp => gp.Game.NumPlayers >= podSize.Min && gp.Game.NumPlayers <= podSize.Max)
                    .ToList();

                if (filteredGameParticipations.Count == 0)
                {
                    continue;
                }

                var filteredDecks = decks
                    .Where(d => d.CreatedAt >= startTime)
                    .ToList();

                // Compute simple stats
                var lastWon = filteredGameParticipations
                    .Where(gp => gp.Won)
                    .FirstOrDefault()?.CreatedAt;

                var isWinStreak = filteredGameParticipations
                    .FirstOrDefault()?.Won;

                var streak = filteredGameParticipations
                    .TakeWhile(gp => gp.Won == isWinStreak && !gp.Game.Imported)
                    .Count();


                // Compute stats for Most Recently Played Deck
                var mrpdDTO = _deckStatsService
                    .ComputeMostRecentPlayedDeckStats(filteredGameParticipations);

                // Compute longest win/loss streaks
                var currWinStreak = 0;
                var currLossStreak = 0;
                var longestWinStreak = 0;
                var longestLossStreak = 0;
                foreach (var gp in filteredGameParticipations)
                {
                    currWinStreak = gp.Won ? currWinStreak + 1 : 0;
                    currLossStreak = !gp.Won ? currLossStreak + 1 : 0;
                    longestWinStreak = Math.Max(currWinStreak, longestWinStreak);
                    longestLossStreak = Math.Max(currLossStreak, longestLossStreak);
                }

                // Compute most/least played commanders
                var commandersByPlayrate = filteredGameParticipations
                    .GroupBy(gp => gp.Deck.Commander)
                    .Select(group => new { Count = group.Count(), group.Key })
                    .OrderByDescending(grouping => grouping.Count)
                    .ToList();

                var mostPlayedCommanders = commandersByPlayrate
                    .Select(grouping => grouping.Key)
                    .Take(3)
                    .ToList();

                var leastPlayedCommanders = commandersByPlayrate
                    .Select(grouping => grouping.Key)
                    .TakeLast(3)
                    .ToList();

                // Group games/wins/losses by time period for displaying on Line Chart
                int bucketCount = 12;

                var firstDate = filteredGameParticipations.Last().CreatedAt;
                var lastDate = filteredGameParticipations.First().CreatedAt;
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

                foreach (var gp in filteredGameParticipations)
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

                var deckPlayCounts = commandersByPlayrate
                    .Select(grouping => new DeckPlayCount()
                    {
                        Commander = grouping.Key,
                        NumGames = grouping.Count,
                        PercentOfGamesPlayed = (double)grouping.Count / filteredGameParticipations.Count
                    })
                    .ToList();

                var snapshotDTO = new StatSnapshotDTO()
                {
                    GamesPlayed = filteredGameParticipations.Count,
                    GamesWon = filteredGameParticipations.Where(gp => gp.Won).Count(),
                    NumDecks = filteredDecks.Count,
                    LastWon = lastWon,
                    MostPlayedCommanders = mostPlayedCommanders ?? [],
                    LeastPlayedCommanders = leastPlayedCommanders ?? [],
                    CurrentWinStreak = streak,
                    IsCurrentWinStreak = isWinStreak,
                    WinLossGamesByPeriod = buckets,
                    DeckPlayCounts = deckPlayCounts,
                    LongestWinStreak = longestWinStreak,
                    LongestLossStreak = longestLossStreak,
                    CreatedAt = user.StatSnapshot.CreatedAt,
                    MostRecentPlayedDeck = mrpdDTO,
                };


                var filteredSnapshotDTO = new FilteredStatSnapshotDTO()
                {
                    Period = periodStartTimeToLabel[startTime],
                    PlayerCount = podSize.Min,
                    Snapshot = snapshotDTO,
                };

                filteredSnapshotDTOs.Add(filteredSnapshotDTO);
            }
        }

        return filteredSnapshotDTOs;
    }

    // PUT: api/statsnapshot
    // Update stat snapshot for current user
    [Authorize]
    [HttpPut]
    public async Task<ActionResult> PutStatSnapshot(StatSnapshotDTO statsDTO)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(u => u.StatSnapshot)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
        {
            return Unauthorized();
        }

        user.StatSnapshot = _mapper.Map<StatSnapshot>(statsDTO);
        user.StatSnapshot.UserId = userId;

        await _context.SaveChangesAsync();

        return Ok();
    }
}