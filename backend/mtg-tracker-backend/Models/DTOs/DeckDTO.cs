namespace Mtg_tracker.Models.DTOs;

public class DeckReadDTO
{
    public int Id { get; set; }
    public string UserId { get; set; } = null!;
    public required string Commander { get; set; }
    public required string Moxfield { get; set; }
    public int NumGames { get; set; }
    public int NumWins { get; set; }
}

public class DeckWriteDTO
{
    public string UserId { get; set; } = null!;
    public required string Commander { get; set; }
    public required string Moxfield { get; set; }
    public int NumGames { get; set; }
    public int NumWins { get; set; }
}