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
public class GameController(MtgContext context, IMapper mapper) : ControllerBase
{
    private readonly MtgContext _context = context;
    private readonly IMapper _mapper = mapper;

    // GET: api/game
    // Returns all games
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GameDTO>>> GetGames()
    {
        var games = await _context.Games.ToListAsync();
        return _mapper.Map<List<GameDTO>>(games);
    }

    // GET: api/game/{id}
    // Returns details for a specific game
    [HttpGet]
    public async Task<ActionResult<GameDTO>> GetGame(int id)
    {
        var game = await _context.Games.FindAsync(id);
        if (game is null)
        {
            return NotFound();
        }

        return _mapper.Map<GameDTO>(game);
    }

    // POST: api/game
    // Create a new game
    [Authorize]
    [HttpPost]
    public async Task<ActionResult> PostGame()
    {
        Game game = new();
        _context.Games.Add(game);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetGame),
            new { id = game.Id },
            _mapper.Map<GameDTO>(game)
        );
    }
}