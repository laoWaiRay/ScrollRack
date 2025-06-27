namespace Mtg_tracker.Models.DTOs;

public class DeckStats
{
    public required int NumGames { get; set; }
    public required int NumWins { get; set; }
    public DateTime? LatestWin { get; set; }
    public int? CurrentStreak { get; set; }
    public bool? IsCurrentWinStreak { get; set; }
    public int? LongestWinStreak { get; set; } = 0;
    public int? LongestLossStreak { get; set; } = 0;
    public int? FastestWinInSeconds { get; set; }
    public int? SlowestWinInSeconds { get; set; }
    public double? Par { get; set; }
}

public class FilteredDeckStats
{
    // 0: All Pods
    // 2-4: 2/3/4 Pods
    // 5: 5+ Pods
    public required int PodSize { get; set; }
    public required DeckStats Stats { get; set; }
}

public class DeckReadDTO
{
    public required int Id { get; set; }
    public required string UserId { get; set; } = null!;
    public required string Commander { get; set; }
    public required string Moxfield { get; set; }
    public required string ScryfallId { get; set; }
    public required DateTime CreatedAt { get; set; }

    // Computed per Pod size
    public List<FilteredDeckStats>? Statistics { get; set; } = [];
}

public class DeckWriteDTO
{
    public required string UserId { get; set; } = null!;
    public required string Commander { get; set; }
    public required string Moxfield { get; set; }
    public required string ScryfallId { get; set; }
    public required int NumGames { get; set; }
    public required int NumWins { get; set; }
}