namespace Mtg_tracker.Models;

public class StatSnapshot
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}
