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
public class FriendRequestController(MtgContext context, IMapper mapper) : ControllerBase
{
    private readonly MtgContext _context = context;
    private readonly IMapper _mapper = mapper;

    // GET: api/friendrequest/received
    // Returns all received friend requests
    [Authorize]
    [HttpGet("received")]
    public async Task<ActionResult<IEnumerable<FriendRequestDTO>>> GetReceived()
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        List<FriendRequest> receivedRequests = await _context.FriendRequests
            .Where(fr => fr.ReceiverId == userId)
            .ToListAsync();

        return _mapper.Map<List<FriendRequestDTO>>(receivedRequests);
    }

    // GET: api/friendrequest/received
    // Returns all received friend requests
    [Authorize]
    [HttpGet("sent")]
    public async Task<ActionResult<IEnumerable<FriendRequestDTO>>> GetSent()
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        List<FriendRequest> sentRequests = await _context.FriendRequests
            .Where(fr => fr.SenderId == userId)
            .ToListAsync();

        return _mapper.Map<List<FriendRequestDTO>>(sentRequests);
    }

    // POST api/friendrequest/{receiver_id}
    // Sends a friend request
    [Authorize]
    [HttpPost("{receiverId}")]
    public async Task<ActionResult> PostFriendRequest(string receiverId)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(u => u.Friends)
            .FirstOrDefaultAsync(u => u.Id == userId);

        var receiver = await _context.Users.FindAsync(receiverId);

        if (user is null)
        {
            return Unauthorized();
        }

        if (receiver is null)
        {
            return NotFound();
        }

        // Check users are not already friends
        var isAlreadyFriend = user.Friends.Any(u => u.Id == receiverId);
        if (isAlreadyFriend)
        {
            return BadRequest();
        }
        
        var friendRequest = new FriendRequest
        {
            SenderId = userId,
            ReceiverId = receiverId
        };

        _context.FriendRequests.Add(friendRequest);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            // This could happen if A has already received a request from B,
            // and A tries to send a request to B.
            return StatusCode(500, "Could not send friend requesst"); 
        }

        return Ok();
    }

    // DELETE api/friendrequest/{id}
    // Delete a friend request (sent or received)
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFriendRequest(int id)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var friendRequest = await _context.FriendRequests.FindAsync(id);
        if (friendRequest is null)
        {
            return NotFound();
        }

        if (friendRequest.SenderId != userId && friendRequest.ReceiverId != userId)
        {
            return Unauthorized();
        }

        _context.FriendRequests.Remove(friendRequest);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DBConcurrencyException) when (!FriendRequestExists(id))
        {
            return NotFound();
        }

        return NoContent();
    }

    private bool FriendRequestExists(int id) =>
        _context.FriendRequests.Any(fr => fr.Id == id);
}