namespace Mtg_tracker.Models;

public class Deck
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    
    public List<GameParticipation> GameParticipations { get; } = [];

    public required string Commander { get; set; }
    public required string ScryfallId { get; set; }
    public string? Moxfield { get; set; }
    public int NumGames { get; set; }
    public int NumWins { get; set; }
}