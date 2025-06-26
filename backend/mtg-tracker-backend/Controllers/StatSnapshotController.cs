using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;
using Mtg_tracker.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

namespace Mtg_tracker.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StatSnapshotController(MtgContext context, IMapper mapper) : ControllerBase
{
    private readonly MtgContext _context = context;
    private readonly IMapper _mapper = mapper;

    // Returns all-time, year, and month stat snapshots for the current user
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<StatSnapshotsByPeriodDTO>> GetStatSnapshot()
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

        // These statistics do not change depending on the time period and only have to be
        // computed once: 
        //  lastWon,
        //  currentWinStreak,
        //  isCurrentWinstreak

        var lastWon = gameParticipations.FirstOrDefault()?.CreatedAt;

        var isWinStreak = gameParticipations
            .FirstOrDefault(gp => gp.Won)?.Won;

        var streak = gameParticipations
            .TakeWhile(gp => gp.Won == isWinStreak && !gp.Game.Imported)
            .Count();

        // All other statistics are computed for each time period (All-time, Current Year, Current Month)
        DateTime now = DateTime.Now;
        DateTime[] periodStartTimes = [
            new DateTime(2000, 1, 1),
            new DateTime(now.Year, 1, 1),
            new DateTime(now.Year, now.Month, 1),
        ];

        List<StatSnapshotDTO> snapshotsDTOs = [];
        foreach (DateTime startTime in periodStartTimes)
        {
            gameParticipations = [.. gameParticipations.Where(gp => gp.CreatedAt >= startTime)];
            decks = [.. decks.Where(d => d.CreatedAt >= startTime)];


            var commandersByPlayrate = gameParticipations
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

            var deckPlayCounts = commandersByPlayrate
                .Select(grouping => new DeckPlayCount()
                {
                    Commander = grouping.Key,
                    NumGames = grouping.Count,
                    PercentOfGamesPlayed = (double)grouping.Count / gameParticipations.Count
                })
                .ToList();

            var snapshot = new StatSnapshotDTO()
            {
                GamesPlayed = gameParticipations.Count,
                GamesWon = gameParticipations.Where(gp => gp.Won).Count(),
                NumDecks = decks.Count,
                LastWon = lastWon,
                MostPlayedCommanders = mostPlayedCommanders ?? [],
                LeastPlayedCommanders = leastPlayedCommanders ?? [],
                CurrentWinStreak = streak,
                IsCurrentWinStreak = isWinStreak,
                WinLossGamesByPeriod = buckets,
                DeckPlayCounts = deckPlayCounts,
                LongestWinStreak = user.StatSnapshot.LongestWinStreak,
                LongestLossStreak = user.StatSnapshot.LongestLossStreak,
                CreatedAt = user.StatSnapshot.CreatedAt,
            };

            snapshotsDTOs.Add(snapshot);
        }

        return new StatSnapshotsByPeriodDTO()
        {
            AllTime = snapshotsDTOs[0],
            CurrentYear = snapshotsDTOs[1],
            CurrentMonth = snapshotsDTOs[2]
        };
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