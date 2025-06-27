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
    public DeckReadDTO? MostRecentPlayedDeck { get; set; }
    public required List<string> MostPlayedCommanders { get; set; }
    public required List<string> LeastPlayedCommanders { get; set; }
    public required int CurrentWinStreak { get; set; }
    public bool? IsCurrentWinStreak { get; set; }
    public List<WinLossGameCount> WinLossGamesByPeriod { get; set; } = [];
    public List<DeckPlayCount> DeckPlayCounts { get; set; } = [];
    public required int LongestWinStreak { get; set; }
    public required int LongestLossStreak { get; set; }

    // Leave this as default value on writes so that EF generates the
    // value on DB insert.
    public DateTime CreatedAt { get; set; }
}

public class FilteredStatSnapshotDTO
{
    // E.g., "AllTime", "CurrentYear", "CurrentMonth"
    public required string Period { get; set; }

    // E.g., 0, 2, 3, 4, or 5 (5 = 5 or more players, 0 = no filter)
    public required int PlayerCount { get; set; }

    public required StatSnapshotDTO Snapshot { get; set; }
}