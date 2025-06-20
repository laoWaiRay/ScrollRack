namespace Mtg_tracker.Models.DTOs;

public class GameDTO
{
    public int NumPlayers { get; set; }
    public int NumTurns { get; set; }
    public int Seconds { get; set; }
    public DateTime CreatedAt { get; set; }
}