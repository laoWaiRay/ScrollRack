namespace Mtg_tracker.Models;

public class User
{
    // Account Details
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public string? Profile { get; set; }

    // Friend Management
    public List<FriendRequest> SentFriendRequests { get; set; } = [];
    public List<FriendRequest> ReceivedFriendRequests { get; set; } = [];
    public List<User> Friends { get; set; } = [];

    // Statistics
    public StatSnapshot? StatSnapshot { get; set; }
}
