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
public class RoomController(MtgContext context, IMapper mapper) : ControllerBase
{
    private readonly MtgContext _context = context;
    private readonly IMapper _mapper = mapper;
    private const int ROOM_CODE_NUM_DIGITS = 6;

    // GET: api/room
    // Returns all rooms for current user
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoomDTO>>> GetRooms()
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }
        var user = await _context.Users.FindAsync(userId);
        if (user is null)
        {
            return BadRequest();
        }

        var rooms = await _context.Rooms
            .Include(r => r.Players)
            .ThenInclude(player => player.Decks)
            .AsSplitQuery()
            .Where(r => r.Players.Contains(user))
            .ToListAsync();

        return _mapper.Map<List<RoomDTO>>(rooms);
    }

    // GET: api/room/{roomCode}
    // Returns details for a specific room
    [Authorize]
    [HttpGet("{roomCode}")]
    public async Task<ActionResult<RoomDTO>> GetRoom(string roomCode)
    {   var rooms = await _context.Rooms
            .Include(r => r.Players)
            .ThenInclude(player => player.Decks)
            .AsSplitQuery()
            .ToListAsync();

        // var room = await _context.Rooms.FirstOrDefaultAsync(r => r.Code == roomCode);
        var room = rooms.FirstOrDefault(r => r.Code == roomCode);

        if (room is null)
        {
            return NotFound();
        }

        return _mapper.Map<RoomDTO>(room);
    }

    // POST: api/room
    // Create a new room
    [Authorize]
    [HttpPost]
    [ProducesResponseType(typeof(RoomDTO), StatusCodes.Status201Created)]
    public async Task<ActionResult<RoomDTO>> PostRoom()
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        // User must not have any hosted or joined rooms before creating a room
        var isCurrentlyInRoom = await _context.Rooms
            .Include(r => r.Players)
            .AnyAsync(r => r.RoomOwnerId == userId ||
                r.Players.Any(p => p.Id == userId));

        if (isCurrentlyInRoom)
        {
            return Conflict("Cannot create a new room when already in one");
        }

        var roomCode = GenerateRoomCode();
        bool codeTaken = false;

        do
        {
            codeTaken = await _context.Rooms.AnyAsync(r => r.Code == roomCode);
            if (codeTaken)
            {
                roomCode = GenerateRoomCode();
            }
        } while (codeTaken);

        var user = await _context.Users.FindAsync(userId);
        if (user is null)
        {
            return Unauthorized();
        }

        var room = new Room
        {
            Code = roomCode,
            RoomOwnerId = userId,
            Players = [user]
        };

        _context.Rooms.Add(room);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, "Unable to create room");
        }

        return CreatedAtAction(
            nameof(GetRoom),
            new { roomCode },
            _mapper.Map<RoomDTO>(room)
        );
    }

    // POST: api/room/{roomCode}
    // Join a room
    [Authorize]
    [HttpPost("{roomCode}")]
    public async Task<ActionResult<RoomDTO>> JoinRoom(string roomCode)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        // User must not have any hosted or joined rooms before joining a room
        var isCurrentlyInRoom = await _context.Rooms
            .Include(r => r.Players)
            .AnyAsync(r => r.RoomOwnerId == userId ||
                r.Players.Any(p => p.Id == userId));

        if (isCurrentlyInRoom)
        {
            return Conflict("Cannot join room when already in one");
        }

        var room = await _context.Rooms
            .Include(r => r.Players)
            .ThenInclude(p => p.Decks)
            .AsSplitQuery()
            .FirstOrDefaultAsync(r => r.Code == roomCode);

        if (room is null)
        {
            return NotFound();
        }

        var user = await _context.Users
            .Include(u => u.Decks)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
        {
            return Unauthorized();
        }

        room.Players.Add(user);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DBConcurrencyException)
        {
            return StatusCode(500, "Error joining room");
        }

        return Ok(_mapper.Map<RoomDTO>(room));
    }

    // POST: api/room/{roomCode}/players
    // Add a player to the room (Host-only)
    [Authorize]
    [HttpPost("{roomCode}/players")]
    public async Task<ActionResult<RoomDTO>> AddPlayer(string roomCode, AddPlayerDTO addPlayerDTO)
    {
        string playerId = addPlayerDTO.Id;
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var room = await _context.Rooms
            .Include(r => r.Players)
            .ThenInclude(p => p.Decks)
            .AsSplitQuery()
            .FirstOrDefaultAsync(r => r.Code == roomCode);

        if (room is null)
        {
            return NotFound();
        }

        // Only Host can add players to the room
        if (room.RoomOwnerId != userId)
        {
            return Unauthorized();
        }

        // Player to add must not already be in a room
        var playerToAdd = await _context.Users
            .Include(u => u.HostedRoom)
            .Include(u => u.JoinedRoom)
            .Include(u => u.Decks)
            .FirstOrDefaultAsync(u => u.Id == playerId);

        if (playerToAdd is null)
        {
            return NotFound();
        }

        if (playerToAdd.HostedRoom is not null || playerToAdd.JoinedRoom is not null)
        {
            return Conflict("Cannot add user already in a room");
        }

        // Check that players are friends before allowing host to manually add
        var host = await _context.Users
            .Include(u => u.Friends)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (host is null ||
            host.Friends is null ||
            host.Friends.Contains(playerToAdd) is false)
        {
            return Unauthorized("Can only add users in host's friend list");
        }

        room.Players.Add(playerToAdd);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(500, "Error adding player to room");
        }

        return Ok(_mapper.Map<RoomDTO>(room));
    }

    // DELETE: api/room/{roomCode}/players/{id}
    // Removes a player from the room (Host only)
    [Authorize]
    [HttpDelete("{roomCode}/players/{id}")]
    public async Task<ActionResult<RoomDTO>> RemovePlayer(string roomCode, string id)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        // Host should not remove themself using this endpoint. Instead they
        // should use the endpoint that deletes the room, which will also remove
        // every joined player.
        if (userId == id)
        {
            return BadRequest();
        }

        var user = await _context.Users
            .Include(u => u.HostedRoom)
            .ThenInclude(r => r!.Players)
            .ThenInclude(p => p.Decks)
            .AsSplitQuery()
            .FirstOrDefaultAsync(u => u.Id == userId);

        // Only the Host can remove a player from the room
        if (user is null ||
            user.HostedRoom is null ||
            user.HostedRoom.Code != roomCode)
        {
            return Unauthorized();
        }

        var playerToRemove = await _context.Users.FindAsync(id);
        if (playerToRemove is null)
        {
            return NotFound();
        }

        user.HostedRoom.Players.Remove(playerToRemove);
        await _context.SaveChangesAsync();

        return Ok(_mapper.Map<RoomDTO>(user.HostedRoom));
    }

    // DELETE: api/room
    // Reset the user's joined/hosted room status:
    //      Deletes the current user's hosted room, if they are hosting.
    //      Otherwise leaves the user's joined room, if they are in one.
    [Authorize]
    [HttpDelete]
    public async Task<IActionResult> DeleteRoom()
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var user = await _context.Users
            .Include(u => u.HostedRoom)
            .Include(u => u.JoinedRoom)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
        {
            return Unauthorized();
        }

        if (user.HostedRoom is not null)
        {
            _context.Rooms.Remove(user.HostedRoom);
            user.HostedRoom = null;
        }

        if (user.JoinedRoom is not null)
        {
            user.JoinedRoom = null;
        }
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return StatusCode(500, "Something went wrong");
        }

        return NoContent();
    }

    // Generate a random 6-digit room code, e.g. A3H9ZB
    private static string GenerateRoomCode()
    {
        // ['A' ... 'Z', '0' ... '9']
        char[] lettersAndNumbers = [
            .. Enumerable.Range('A', 'Z' - 'A' + 1).Select(i => (char)i),
            .. Enumerable.Range(0, 10).Select(i => Convert.ToChar(i + '0'))
        ];

        StringBuilder roomCodeBuilder = new(ROOM_CODE_NUM_DIGITS);
        Random rand = new();

        for (int i = 0; i < ROOM_CODE_NUM_DIGITS; i++)
        {
            int randInd = rand.Next(0, lettersAndNumbers.Length);
            roomCodeBuilder.Append(lettersAndNumbers[randInd]);
        }

        return roomCodeBuilder.ToString();
    }
}