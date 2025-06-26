namespace Mtg_tracker.Models.DTOs;

public class WinLossGameCount {
    public required DateTime PeriodStart { get; set; }
    public required DateTime PeriodEnd { get; set; }
    public required int Wins { get; set; }
    public required int Losses { get; set; }
    public required int Games { get; set; }
}

public class DeckPlayCount
{
    public required string Commander { get; set; }
    public required int NumGames { get; set; }
    public required double PercentOfGamesPlayed { get; set; }
}

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
    public List<WinLossGameCount> WinLossGamesByPeriod { get; set; } = [];
    public List<DeckPlayCount> DeckPlayCounts { get; set; } = [];

    // Stored in DB to avoid expensive operations
    public required int LongestWinStreak { get; set; }
    public required int LongestLossStreak { get; set; }

    // Leave this as default value on writes so that EF generates the
    // value on DB insert.
    public DateTime CreatedAt { get; set; }
}

public class StatSnapshotsByPeriodDTO
{
    public required StatSnapshotDTO AllTime { get; set; }    
    public required StatSnapshotDTO CurrentYear { get; set; }    
    public required StatSnapshotDTO CurrentMonth { get; set; }    
}