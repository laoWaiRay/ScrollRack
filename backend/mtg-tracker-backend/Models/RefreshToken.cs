namespace Mtg_tracker.Models;

public class RefreshToken
{
    public string Token { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRevoked { get; set; }
}
