using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;
using Mtg_tracker.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using System.Data;
using Mtg_tracker.Services;
using System.Diagnostics;

namespace Mtg_tracker.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DeckController(MtgContext context, IMapper mapper, DeckStatsService deckStatsService) : ControllerBase
{
    private readonly MtgContext _context = context;
    private readonly IMapper _mapper = mapper;
    private readonly DeckStatsService _deckStatsService = deckStatsService;

    // GET: api/deck
    // Returns all decks for the current user
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DeckReadDTO>>> GetDecks()
    {
        Stopwatch stopwatch = new();
        stopwatch.Start();

        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        List<Deck> userDecks = await _context.Decks
            .Where(d => d.UserId == userId)
            .OrderBy(d => d.Commander)
            .ToListAsync();

        List<GameParticipation> allDeckGameParticipations = await _context.GameParticipations
            .Include(gp => gp.Game)
            .Where(gp => gp.UserId == userId)
            .OrderByDescending(gp => gp.CreatedAt)
            .ToListAsync();

        var userStatSnapshot = await _context.StatSnapshots.FirstOrDefaultAsync(s => s.UserId == userId);

        List<DeckReadDTO> deckReadDTOs = [];

        foreach (var deck in userDecks)
        {
            List<GameParticipation> deckGameParticipations = allDeckGameParticipations
                .Where(gp => gp.DeckId == deck.Id)
                .OrderByDescending(d => d.CreatedAt)
                .ToList();

            var latestWin = deckGameParticipations
                .FirstOrDefault(gp => gp.DeckId == deck.Id && gp.Won)?.CreatedAt;

            var isWinStreak = deckGameParticipations
                .FirstOrDefault(gp => gp.DeckId == deck.Id && !gp.Game.Imported)?.Won;
            var streak = deckGameParticipations
                .TakeWhile(gp => gp.Won == isWinStreak && !gp.Game.Imported)
                .Count();

            var winningGameLengths = deckGameParticipations
                .Where(gp => gp.Won)
                .Select(gp => gp.Game.Seconds)
                .ToList();

            // Calculate Par
            var par = _deckStatsService.ComputePar(deckGameParticipations);

            DeckReadDTO dto = _deckStatsService.ComputeDeckStats(deckGameParticipations, deck);
            deckReadDTOs.Add(dto);
        }

        stopwatch.Stop();
        Console.WriteLine($"GET /api/decks took {stopwatch.Elapsed.Milliseconds}ms");
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