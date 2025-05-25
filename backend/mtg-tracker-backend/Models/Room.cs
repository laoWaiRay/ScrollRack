namespace Mtg_tracker.Models;

public class Room
{
    public int Id { get; set; }
    public int GameId { get; set; }
    public Game Game { get; set; } = null!;

    public required string Code { get; set; }
    public DateTime CreatedAt { get; set; }
}