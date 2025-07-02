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
    private const int PAGE_SIZE = 20;

    // GET: api/game?page=0&startDate=...&endDate=...
    // Games are sorted by most recent first. Returns the most recent Nth page of games.
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<PagedResult<GameReadDTO>>> GetGames(
        [FromQuery] int page,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var query = _context.Games
            .Where(g => g.GameParticipations.Any(gp => gp.UserId == userId));

        if (startDate != null && endDate != null)
        {
            query = query.Where(g => g.CreatedAt >= startDate && g.CreatedAt <= endDate);
        }

        query = query
            .Include(g => g.CreatedBy)
            .Include(g => g.GameParticipations)
               .ThenInclude(gp => gp.Deck)
            .Include(g => g.GameParticipations)
               .ThenInclude(gp => gp.User)
            .OrderByDescending(g => g.CreatedAt);

        var pagedGames = await query
            .Skip(page * PAGE_SIZE)
            .Take(PAGE_SIZE + 1)
            .ToListAsync();

        var games = pagedGames.Take(PAGE_SIZE).ToList();

        PagedResult<GameReadDTO> result = new()
        {
            Items = _mapper.Map<List<GameReadDTO>>(games),
            Page = page,
            HasMore = pagedGames.Count > PAGE_SIZE,
        };

        return result;
    }

    // GET: api/game/{id}
    // Returns details for a specific game
    [Authorize]
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
    public async Task<ActionResult<GameReadDTO>> PostGame(GameWriteDTO gameWriteDTO)
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

        Game? game = _mapper.Map<Game>(gameWriteDTO);

        _context.Games.Add(game);
        await _context.SaveChangesAsync();

        game = await _context.Games
            .Include(g => g.Winner)
            .FirstOrDefaultAsync(g => g.Id == game.Id);

        if (game is null)
        {
            return StatusCode(500);
        }

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