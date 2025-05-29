namespace Mtg_tracker.Models.DTOs;

public class StatSnapshotDTO
{ 
    public int GamesPlayed { get; set; }
    public int GamesWon { get; set; }
    public int NumDecks { get; set; }
    public int CurrentWinStreak { get; set; }
    public int CurrentLossStreak { get; set; }
    public int LongestWinStreak { get; set; }
    public int LongestLossStreak { get; set; }

    // Leave this as default value on writes so that EF generates the
    // value on DB insert.
    public DateTime CreatedAt { get; set; }
}