using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;

namespace Mtg_tracker.Hubs;

public interface IRoomClient
{
    Task ReceiveUpdateRoom(RoomDTO room);
    Task ReceivePlayerJoin();
    Task ReceivePlayerLeave();
    Task ReceivePlayerAdd();
    Task ReceivePlayerRemove();
    Task ReceiveCloseRoom();
    Task ReceiveGameStart();
    Task ReceiveGameEnd();
}

[Authorize]
public class RoomHub(MtgContext dbContext) : Hub<IRoomClient>
{
    private readonly MtgContext _dbContext = dbContext;

    // Broadcast by the host to synchronize all players in the room
    public async Task UpdateRoom(string roomCode, RoomDTO room)
    {
        await Clients.Group(ToGroupName(roomCode)).ReceiveUpdateRoom(room);
    }

    // Used by host and players to notify the host that a new player has joined
    public async Task PlayerJoin(string roomCode)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, ToGroupName(roomCode));
        await Clients.Group(ToGroupName(roomCode)).ReceivePlayerJoin();
    }

    // Used by host and players to notify the host that a player has left
    public async Task PlayerLeave(string roomCode)
    {
        await Clients.Group(ToGroupName(roomCode)).ReceivePlayerLeave();
    }

    // Used by host to inform a player that they have been added to a room
    public async Task PlayerAdd(string userId, string roomCode)
    {
        Console.WriteLine(userId);
        await Groups.AddToGroupAsync(Context.ConnectionId, ToGroupName(roomCode));
        await Clients.User(userId).ReceivePlayerAdd();
    }

    // Used by host to inform a player that they have been removed from a room
    public async Task PlayerRemove(string userId)
    {
        await Clients.User(userId).ReceivePlayerRemove();
    }

    public async Task CloseRoom(string roomCode)
    {
        await Clients.Group(ToGroupName(roomCode)).ReceiveCloseRoom();
    }

    public async Task GameStart(string roomCode)
    {
        await Clients.Group(ToGroupName(roomCode)).ReceiveGameStart();
    }

    public async Task GameEnd(string roomCode)
    {
        await Clients.Group(ToGroupName(roomCode)).ReceiveGameEnd();
    }

    // Just for logging
    public override async Task OnConnectedAsync()
    {
        // Console.WriteLine($"Connected: ${Context.UserIdentifier} <===> ${Context.ConnectionId}");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // Console.WriteLine($"Disconnected: ${Context.UserIdentifier} <===> ${Context.ConnectionId}");
        await base.OnDisconnectedAsync(exception);
    }

    private static string ToGroupName(string roomCode)
    {
        return $"room:{roomCode}";
    }
}