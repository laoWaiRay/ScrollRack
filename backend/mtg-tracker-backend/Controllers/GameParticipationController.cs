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
            .Include(u => u.GameParticipations)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
        {
            return Unauthorized();
        }

        return _mapper.Map<List<GameParticipationReadDTO>>(user.GameParticipations);
    }

    // POST: api/gameparticipation
    [Authorize]
    [HttpPost]
    public async Task<ActionResult> PostGameParticipation(GameParticipationWriteDTO gpwDTO)
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

        return Ok();
    }

}