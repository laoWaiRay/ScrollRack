namespace Mtg_tracker.Models.DTOs;

public class GameParticipationReadDTO
{
    public required string Id { get; set; }
    public required int GameId { get; set; }
    public required string UserId { get; set; }
    public required UserReadMinimalDTO User { get; set; }
    public required int DeckId { get; set; }
    public required DeckReadDTO Deck { get; set; }
    public required bool Won { get; set; }
}

public class GameParticipationWriteDTO
{
    public required string UserId { get; set; }
    public required int GameId { get; set; }
    public required int DeckId { get; set; }
    public required bool Won { get; set; }
}