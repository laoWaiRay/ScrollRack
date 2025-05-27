using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;
using Mtg_tracker.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using System.Data;

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
    public async Task<ActionResult<IEnumerable<DeckDTO>>> GetDecks()
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        List<Deck> userDecks = await _context.Decks
            .Where(d => d.UserId == userId)
            .ToListAsync();

        return _mapper.Map<List<DeckDTO>>(userDecks);
    }

    // POST: api/deck
    // Creates a new deck for the current user
    [Authorize]
    [HttpPost]
    public async Task<ActionResult> PostDeck(DeckDTO deckDTO)
    {
        var userId = User.GetUserId();
        if (userId is null || await _context.UserExists(userId) is false)
        {
            return Unauthorized();
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
            nameof(GetDecks),
            new { id = deck.Id },
            _mapper.Map<DeckDTO>(deck)
        );
    }

    // PUT: api/deck/{id}
    // Update a deck
    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<DeckDTO>> PutDeck(DeckDTO deckDTO, int id)
    {
        var userId = User.GetUserId();
        if (userId != User.GetUserId())
        {
            return Unauthorized();
        }

        if (deckDTO.Id != id)
        {
            return BadRequest();
        }

        var deck = await _context.Decks.FindAsync(id);
        if (deck is null)
        {
            return NotFound();
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

        return NoContent();
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