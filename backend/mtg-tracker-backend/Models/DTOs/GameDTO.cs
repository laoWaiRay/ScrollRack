namespace Mtg_tracker.Models.DTOs;

public class GameReadDTO
{
    public required int Id { get; set; }
    public required int NumPlayers { get; set; }
    public required int NumTurns { get; set; }

    // Games that don't track time set Seconds to 0
    public required int Seconds { get; set; }

    public required DateTime CreatedAt { get; set; }
    public string? CreatedByUserId { get; set; }

    public string? WinnerId { get; set; }

    public List<GameParticipationReadDTO> GameParticipations { get; set; } = [];
}

public class GameWriteDTO
{
    public required int NumPlayers { get; set; }
    public required int NumTurns { get; set; }
    public required int Seconds { get; set; }
    public required DateTime CreatedAt { get; set; }
    public int? RoomId { get; set; }

    public required string CreatedByUserId { get; set; }
    public required string WinnerId { get; set; }

    public bool? Imported { get; set; } = false;
}