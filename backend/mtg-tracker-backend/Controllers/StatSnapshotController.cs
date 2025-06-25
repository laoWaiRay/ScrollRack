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

    // GET: api/statsnapshot?startDate=...
    // Returns stat snapshot for the current user
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<StatSnapshotDTO>> GetStatSnapshot([FromQuery] DateTime? startDate)
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

        if (user.StatSnapshot is null) {
            return NotFound();
        }

        var gameParticipationsQuery = _context.GameParticipations
            .Include(gp => gp.Game)
            .Where(gp => gp.UserId == userId);
        
        if (startDate != null)
        {
            gameParticipationsQuery = gameParticipationsQuery
                .Where(gp => gp.CreatedAt >= startDate);
        }

        var gameParticipations = await gameParticipationsQuery
            .OrderByDescending(gp => gp.CreatedAt)
            .ToListAsync();

        var deckQuery = _context.Decks
            .Where(d => d.UserId == userId);

        if (startDate != null)
        {
            deckQuery = deckQuery
                .Where(d => d.CreatedAt >= startDate);
        }

        var decks = await deckQuery.ToListAsync();

        var isWinStreak = gameParticipations
            .FirstOrDefault(gp => gp.Won)?.Won;

        var streak = gameParticipations
            .TakeWhile(gp => gp.Won == isWinStreak && !gp.Game.Imported)
            .Count();

        var lastWon = gameParticipations.FirstOrDefault()?.CreatedAt;

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
            LongestWinStreak = user.StatSnapshot.LongestWinStreak,
            LongestLossStreak = user.StatSnapshot.LongestLossStreak,
            CreatedAt = user.StatSnapshot.CreatedAt,
        };

        return snapshot;
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