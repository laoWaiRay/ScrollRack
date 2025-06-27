using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;
using Mtg_tracker.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;
using Mtg_tracker.Services;
using System.Diagnostics;

namespace Mtg_tracker.Controllers;

public record PodSizeConstraint(int Min, int Max);

[Route("api/[controller]")]
[ApiController]
public class StatSnapshotController(MtgContext context, IMapper mapper, DeckStatsService deckStatsService) : ControllerBase
{
    private readonly MtgContext _context = context;
    private readonly IMapper _mapper = mapper;
    private readonly DeckStatsService _deckStatsService = deckStatsService;

    // Returns stat snapshots for the current user, organized by time period and pod size
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<List<FilteredStatSnapshotDTO>>> GetStatSnapshot()
    {
        Stopwatch stopwatch = new();
        stopwatch.Start();
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

        // Stats are computed for each time period (All-time, Current Year, Current Month) and for
        // each pod size
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

        List<FilteredStatSnapshotDTO> filteredSnapshotDTOs = [];

        foreach (var podSize in _deckStatsService.PodSizeConstraints)
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

                // Compute stats for Most Recently Played Deck
                var mostRecentPlayedDeck = filteredGameParticipations.FirstOrDefault()?.Deck;

                var mrpdGameParticipations = filteredGameParticipations
                    .Where(gp => gp.DeckId == mostRecentPlayedDeck?.Id)
                    .ToList();

                DeckReadDTO? mrpdDTO = null;
                if (mostRecentPlayedDeck != null)
                {
                    mrpdDTO = _deckStatsService
                        .ComputeDeckStats(mrpdGameParticipations, mostRecentPlayedDeck);
                }

                // Compute streak stats
                var streakStats = _deckStatsService.ComputeStreakStats(filteredGameParticipations);

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
                var buckets = _deckStatsService.ComputeWinLossGameCounts(filteredGameParticipations);

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
                    CurrentWinStreak = streakStats.CurrentStreak,
                    IsCurrentWinStreak = streakStats.IsCurrentWinStreak,
                    WinLossGamesByPeriod = buckets,
                    DeckPlayCounts = deckPlayCounts,
                    LongestWinStreak = streakStats.LongestWinStreak,
                    LongestLossStreak = streakStats.LongestLossStreak,
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

        stopwatch.Stop();
        Console.WriteLine($"Total Time for GET StatSnapshots: {stopwatch.Elapsed.TotalMilliseconds}");
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