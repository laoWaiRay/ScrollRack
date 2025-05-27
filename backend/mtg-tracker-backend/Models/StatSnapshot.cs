namespace Mtg_tracker.Models;

public class StatSnapshot
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;

    public int GamesPlayed { get; set; }
    public int GamesWon { get; set; }
    public int NumDecks { get; set; }
    public int CurrentWinStreak { get; set; }
    public int CurrentLossStreak { get; set; }
    public int LongestWinStreak { get; set; }
    public int LongestLossStreak { get; set; }
    public DateTime CreatedAt { get; set; }
}
