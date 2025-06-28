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
public class GameParticipationController(MtgContext context, IMapper mapper) : ControllerBase
{
    private readonly MtgContext _context = context;
    private readonly IMapper _mapper = mapper;

    // GET: api/gameparticipation
    // Returns all game participations for the current user
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GameParticipationReadDTO>>> GetGameParticipations()
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);


        if (user is null)
        {
            return Unauthorized();
        }

        var gameParticipations = await _context.GameParticipations
            .Where(gp => gp.UserId == userId)
            .Include(gp => gp.User)
            .Include(gp => gp.Deck)
            .ToListAsync();

        return _mapper.Map<List<GameParticipationReadDTO>>(gameParticipations);
    }

    // POST: api/gameparticipation?imported=false
    // Used by a Room Host to add game participations for players in the room
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<GameParticipationReadDTO>> PostGameParticipation(
        GameParticipationWriteDTO gpwDTO,
        [FromQuery] bool imported = false)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(u => u.HostedRoom)
            .Include(u => u.GameParticipations)
            .FirstOrDefaultAsync(u => u.Id == userId);

        // Shortcut for imported games: No room, no host in this context => less checks
        if (imported)
        {
            var playerToAdd = await _context.Users
                .Include(u => u.Decks)
                .FirstOrDefaultAsync(u => u.Id == gpwDTO.UserId);

            if (playerToAdd is null)
            {
                return NotFound("Could not find user");
            }

            // Verify the deck belongs to the user
            var isOwner = playerToAdd.Decks.Any(d => d.Id == gpwDTO.DeckId);

            if (!isOwner)
            {
                return BadRequest();
            }

            var importedGp = _mapper.Map<GameParticipation>(gpwDTO);

            _context.GameParticipations.Add(importedGp);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception e) when (e is DbUpdateConcurrencyException || e is DbUpdateException)
            {
                return StatusCode(500, "Error creating game participation");
            }

            return Ok(_mapper.Map<GameParticipationReadDTO>(importedGp));
        }

        var game = await _context.Games
            .Include(g => g.Room)
            .FirstOrDefaultAsync(g => g.Id == gpwDTO.GameId);

        if (game is null || game.Room is null)
        {
            return NotFound("Could not find game");
        }

        // Only the host can create game participations
        if (user is null ||
            user.HostedRoom is null ||
            user.HostedRoom.Code != game.Room.Code)
        {
            return Unauthorized();
        }

        var userToAdd = await _context.Users
            .Include(u => u.JoinedRoom)
            .Include(u => u.Decks)
            .FirstOrDefaultAsync(u => u.Id == gpwDTO.UserId);

        if (userToAdd is null)
        {
            return NotFound("Could not find user");
        }

        // Only allow creating a gameparticipation if the user is the host or
        // the user is currently in the room
        if (userToAdd.Id != userId && (userToAdd.JoinedRoom is null || userToAdd.JoinedRoom.Code != game.Room.Code))
        {
            return BadRequest();
        }

        // Verify the deck belongs to the user
        var isDeckOwner = userToAdd.Decks.Any(d => d.Id == gpwDTO.DeckId);

        if (!isDeckOwner)
        {
            return BadRequest();
        }

        var gameParticipation = _mapper.Map<GameParticipation>(gpwDTO);

        _context.GameParticipations.Add(gameParticipation);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception e) when (e is DbUpdateConcurrencyException || e is DbUpdateException)
        {
            return StatusCode(500, "Error creating game participation");
        }

        return Ok(_mapper.Map<GameParticipationReadDTO>(gameParticipation));
    }
}