using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;
using Mtg_tracker.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using System.Data;
using System.Text.Json;

namespace Mtg_tracker.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DeckController(MtgContext context, IMapper mapper) : ControllerBase
{
    private readonly MtgContext _context = context;
    private readonly IMapper _mapper = mapper;

    // GET: api/deck
    // Returns all decks for the current user
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DeckReadDTO>>> GetDecks()
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        List<Deck> userDecks = await _context.Decks
            .Where(d => d.UserId == userId)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync();

        var allDeckGameParticipations = await _context.GameParticipations
            .Include(gp => gp.Game)
            .Where(gp => gp.UserId == userId)
            .OrderByDescending(gp => gp.CreatedAt)
            .ToListAsync();

        var userStatSnapshot = await _context.StatSnapshots.FirstOrDefaultAsync(s => s.UserId == userId);

        List<DeckReadDTO> deckReadDTOs = [];

        foreach (var deck in userDecks)
        {
            var deckGameParticipations = allDeckGameParticipations
                .Where(gp => gp.DeckId == deck.Id)
                .OrderByDescending(d => d.CreatedAt)
                .ToList();

            var latestWin = deckGameParticipations?
                .FirstOrDefault(gp => gp.DeckId == deck.Id && gp.Won)?.CreatedAt;

            var isWinStreak = deckGameParticipations?
                .FirstOrDefault(gp => gp.DeckId == deck.Id && !gp.Game.Imported)?.Won;
            var streak = deckGameParticipations?
                .TakeWhile(gp => gp.Won == isWinStreak && !gp.Game.Imported)
                .Count();

            if (isWinStreak.HasValue && streak.HasValue)
            {
                if (isWinStreak == true && streak > deck.LongestWinStreak)
                {
                    deck.LongestWinStreak = streak.Value;
                }
                if (isWinStreak == false && streak > deck.LongestLossStreak)
                {
                    deck.LongestLossStreak = streak.Value;
                }
            }

            var winningGameLengths = deckGameParticipations?
                .Where(gp => gp.Won)
                .Select(gp => gp.Game.Seconds)
                .ToList();

            // Calculate Par
            var parsByPodSize = deckGameParticipations?
                .GroupBy(gp => gp.Game.NumPlayers)
                .Select(group => 1.0 / group.Key * group.Count());

            double par = 0.0;

            if (parsByPodSize != null && deckGameParticipations != null)
            {
                par = parsByPodSize.Aggregate(0.0, (current, next) =>
                {
                    return current + next;
                });

                if (deckGameParticipations.Count > 0)
                {
                    par /= deckGameParticipations.Count;
                }
                else
                {
                    par = 0.0;
                }
            }

            var dto = _mapper.Map<DeckReadDTO>(deck);
            dto.LatestWin = latestWin;
            dto.IsCurrentWinStreak = isWinStreak;
            dto.CurrentStreak = streak;
            dto.NumGames = deckGameParticipations != null ? deckGameParticipations.Count : 0;
            dto.NumWins = deckGameParticipations != null ? deckGameParticipations.Where(gp => gp.Won).Count() : 0;
            dto.FastestWinInSeconds = winningGameLengths?.Count > 0 ? winningGameLengths.Min() : 0;
            dto.SlowestWinInSeconds = winningGameLengths?.Count > 0 ? winningGameLengths.Max() : 0;
            dto.Par = par;
            deckReadDTOs.Add(dto);
        }

        await _context.SaveChangesAsync();

        return deckReadDTOs;
    }

    // GET: api/deck/{id}
    // Get a specific deck by id
    [Authorize]
    [HttpGet("{id}")]
    public async Task<ActionResult<DeckReadDTO>> GetDeck(int id)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var deck = await _context.Decks.FindAsync(id);
        return _mapper.Map<DeckReadDTO>(deck);
    }

    // POST: api/deck
    // Creates a new deck for the current user
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<DeckReadDTO>> PostDeck(DeckWriteDTO deckDTO)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(u => u.Decks)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
        {
            return Unauthorized();
        }

        if (user.Decks.Any(deck => deck.Commander == deckDTO.Commander))
        {
            return Conflict();
        }

        var deck = _mapper.Map<Deck>(deckDTO);
        deck.UserId = userId;
        _context.Decks.Add(deck);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, "Error creating deck");
        }

        return CreatedAtAction(
            nameof(GetDeck),
            new { id = deck.Id },
            _mapper.Map<DeckReadDTO>(deck)
        );
    }

    // PUT: api/deck/{id}
    // Update a deck
    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<DeckReadDTO>> PutDeck(DeckWriteDTO deckDTO, int id)
    {
        var deck = await _context.Decks.FindAsync(id);
        if (deck is null)
        {
            return NotFound();
        }

        if (deck.UserId != User.GetUserId())
        {
            return Unauthorized();
        }

        deck.Moxfield = deckDTO.Moxfield;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<DeckReadDTO>(deck));
    }

    // DELETE api/deck/{id}
    // Deletes a deck
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDeck(int id)
    {
        var deck = await _context.Decks.FindAsync(id);
        if (deck is null)
        {
            return NotFound();
        }

        if (deck.UserId != User.GetUserId())
        {
            return Unauthorized();
        }

        _context.Decks.Remove(deck);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}