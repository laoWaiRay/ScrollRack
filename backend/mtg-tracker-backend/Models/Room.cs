namespace Mtg_tracker.Models;

/*
 * Rooms should only persist for as long as a host is adding games to it
 * (typically a few hours for a night of Commander). They are just used
 * to add users to the same Game(s).
 */

public class Room
{
    public int Id { get; set; }
    public int GameId { get; set; }
    public Game Game { get; set; } = null!;

    // The user that created the room
    public string RoomOwnerId { get; set; } = null!;
    public ApplicationUser RoomOwner { get; set; } = null!;

    // Players (not including the room owner)
    public List<ApplicationUser> Players { get; set; } = [];

    public required string Code { get; set; }
    public DateTime CreatedAt { get; set; }
}