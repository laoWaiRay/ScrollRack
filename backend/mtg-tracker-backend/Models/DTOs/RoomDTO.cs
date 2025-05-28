namespace Mtg_tracker.Models.DTOs;

public class RoomDTO
{
    public int Id { get; set; }
    public int GameId { get; set; }
    public required string Code { get; set; }
    public required string RoomOwnerId { get; set; }
    public DateTime CreatedAt { get; set; }
}