namespace Mtg_tracker.Models.DTOs;

public class StatSnapshotDTO
{ 
    // Computed Values
    public required int GamesPlayed { get; set; }
    public required int GamesWon { get; set; }
    public required int NumDecks { get; set; }
    public DateTime? LastWon { get; set; }
    public required List<string> MostPlayedCommanders { get; set; }
    public required List<string> LeastPlayedCommanders { get; set; }
    public required int CurrentWinStreak { get; set; }
    public bool? IsCurrentWinStreak { get; set; }
    
    // Stored in DB to avoid expensive operations
    public required int LongestWinStreak { get; set; }
    public required int LongestLossStreak { get; set; }

    // Leave this as default value on writes so that EF generates the
    // value on DB insert.
    public DateTime CreatedAt { get; set; }
}