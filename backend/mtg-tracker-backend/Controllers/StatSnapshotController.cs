using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;
using Mtg_tracker.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using System.Text;
using System.Data;

namespace Mtg_tracker.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StatSnapshotController(MtgContext context, IMapper mapper) : ControllerBase
{
    private readonly MtgContext _context = context;
    private readonly IMapper _mapper = mapper;

    // GET: api/statsnapshot
    // Returns stat snapshot for the current user
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<StatSnapshotDTO>> GetStatSnapshot()
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

        return _mapper.Map<StatSnapshotDTO>(user.StatSnapshot);
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