namespace Mtg_tracker.Models;

public class Deck
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    public List<GameParticipation> GameParticipations { get; } = [];

    public required string Commander { get; set; }
    public required string Moxfield { get; set; }
    public int NumGames { get; set; }
    public int NumWins { get; set; }
}