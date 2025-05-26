namespace Mtg_tracker.Models.DTOs;

public class GameDTO
{
    public int Id { get; set; }
    public int NumPlayers { get; set; }
    public int NumTurns { get; set; }
    public int Minutes { get; set; }
    public DateTime CreatedAt { get; set; }
}