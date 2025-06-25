namespace Mtg_tracker.Models;

public class Game
{
    public int Id { get; set; }
    public Room? Room { get; set; }
    public int? RoomId { get; set; }

    public List<GameParticipation> GameParticipations { get; } = [];

    public int NumPlayers { get; set; }
    public int NumTurns { get; set; }
    public int? Seconds { get; set; }
    public DateTime CreatedAt { get; set; }

    public string? CreatedByUserId { get; set; }
    public ApplicationUser? CreatedBy { get; set; } = null!;

    public string? WinnerId { get; set; } = null!;
    public ApplicationUser? Winner { get; set; } = null!;

    // If true, the game can be ignored for the purposes of computing certain stats
    //  (e.g. fastest/slowest games, streaks, etc. ).
    public bool Imported { get; set; } = false;
}