namespace Mtg_tracker.Models;

public class User
{
    // Account Details
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public string? Profile { get; set; }

    public List<Deck> Decks { get; } = [];
    public List<GameParticipation> GameParticipations { get; } = [];

    // Friend Management
    public List<User> Friends { get; } = [];

    // Statistics
    public StatSnapshot? StatSnapshot { get; set; }
}
