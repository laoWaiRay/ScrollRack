using Microsoft.AspNetCore.SignalR;
using Mtg_tracker.Models.DTOs;

namespace Mtg_tracker.Hubs;

public interface IRoomClient
{
    Task ReceiveUpdatePlayers(UserReadDTO[] players);
    Task ReceiveCloseRoom();
    Task ReceiveGameStart();
    Task ReceiveGameEnd();
}

public class RoomHub : Hub<IRoomClient>
{
    public async Task UpdatePlayers(string roomCode, UserReadDTO[] players)
    {
        await Clients.Group(ToGroupName(roomCode)).ReceiveUpdatePlayers(players);
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

    public async Task JoinRoomGroup(string roomCode)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, ToGroupName(roomCode));
    }

    public async Task LeaveRoomGroup(string roomCode)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, ToGroupName(roomCode));
    }

    private static string ToGroupName(string roomCode)
    {
        return $"room:{roomCode}";
    }
}