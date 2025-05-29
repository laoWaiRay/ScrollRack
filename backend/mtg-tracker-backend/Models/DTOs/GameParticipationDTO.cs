namespace Mtg_tracker.Models.DTOs;

public class GameParticipationReadDTO
{
    public int Id { get; set; }
    public bool Won { get; set; }
}

public class GameParticipationWriteDTO
{
    public required string UserId { get; set; }
    public int GameId { get; set; }
    public int DeckId { get; set; }
    public bool Won { get; set; }
}