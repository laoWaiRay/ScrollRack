using Microsoft.AspNetCore.Identity;

namespace Mtg_tracker.Models;

public class ApplicationUser : IdentityUser
{
    public string? Profile { get; set; }

    public List<Deck> Decks { get; } = [];
    public List<GameParticipation> GameParticipations { get; } = [];

    // Friend Management
    public List<ApplicationUser> Friends { get; } = [];
    public List<FriendRequest> SentFriendRequests { get; } = [];
    public List<FriendRequest> ReceivedFriendRequests { get; } = [];

    // Statistics
    public StatSnapshot? StatSnapshot { get; set; }
}