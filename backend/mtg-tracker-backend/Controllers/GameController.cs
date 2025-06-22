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
public class GameController(MtgContext context, IMapper mapper) : ControllerBase
{
    private readonly MtgContext _context = context;
    private readonly IMapper _mapper = mapper;

    // GET: api/game
    // Returns all games for the current user
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GameReadDTO>>> GetGames()
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var participatedInGameIds = await _context.GameParticipations
            .Where(gp => gp.UserId == userId)
            .Select(gp => gp.GameId)
            .ToListAsync();

        var games = await _context.Games
            .Where(g => participatedInGameIds.Contains(g.Id))
            .ToListAsync();

        return _mapper.Map<List<GameReadDTO>>(games);
    }

    // GET: api/game/{id}
    // Returns details for a specific game
    [HttpGet("{id}")]
    public async Task<ActionResult<GameReadDTO>> GetGame(int id)
    {
        var game = await _context.Games.FindAsync(id);
        if (game is null)
        {
            return NotFound();
        }

        return _mapper.Map<GameReadDTO>(game);
    }

    // POST: api/game
    // Create a new game
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<GameReadDTO>> PostGame(GameWriteDTO gameDTO)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        // User must be the host of a room to create a game
        var user = await _context.Users
            .Include(u => u.HostedRoom)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
        {
            return Unauthorized();
        }

        if (user.HostedRoom is null)
        {
            return BadRequest("Only room host can create a game");
        }

        Game game = _mapper.Map<Game>(gameDTO);
        game.RoomId = user.HostedRoom.Id;

        _context.Games.Add(game);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetGame),
            new { id = game.Id },
            _mapper.Map<GameReadDTO>(game)
        );
    }

    // DELETE: api/game/{id}
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteGame(int id)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var game = await _context.Games.FindAsync(id);
        if (game is null)
        {
            return NotFound();
        }

        _context.Games.Remove(game);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}