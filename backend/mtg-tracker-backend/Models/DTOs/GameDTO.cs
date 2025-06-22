namespace Mtg_tracker.Models.DTOs;

public class GameReadDTO
{
    public required int Id { get; set; }
    public required int NumPlayers { get; set; }
    public required int NumTurns { get; set; }
    public required int Seconds { get; set; }
    public required DateTime CreatedAt { get; set; }
}

public class GameWriteDTO
{
    public required int NumPlayers { get; set; }
    public required int NumTurns { get; set; }
    public required int Seconds { get; set; }
    public required DateTime CreatedAt { get; set; }
}