namespace Mtg_tracker.Models;

public class Game
{
    public int Id { get; set; }
    public Room? Room { get; set; }
    public required int? RoomId { get; set; }

    public List<GameParticipation> GameParticipations { get; } = [];

    public int NumPlayers { get; set; }
    public int NumTurns { get; set; }
    public int Minutes { get; set; }
    public DateTime CreatedAt { get; set; }
}