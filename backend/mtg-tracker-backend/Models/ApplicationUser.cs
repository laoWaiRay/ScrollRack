using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Mtg_tracker.Models;

public class ApplicationUser : IdentityUser
{
    public string? Profile { get; set; }

    [ProtectedPersonalData]
    [EmailAddress]
    public override string? Email { get; set; }

    public List<Deck> Decks { get; } = [];
    public List<GameParticipation> GameParticipations { get; } = [];

    // A user may either be the host of a game room, or join another
    // user's room, but not both at the same time.
    public Room? HostedRoom { get; set; }

    public Room? JoinedRoom { get; set; }
    public int? JoinedRoomId { get; set; }

    // Friend Management
    public List<ApplicationUser> Friends { get; } = [];
    public List<FriendRequest> SentFriendRequests { get; } = [];
    public List<FriendRequest> ReceivedFriendRequests { get; } = [];

    // Statistics
    public StatSnapshot? StatSnapshot { get; set; }
}