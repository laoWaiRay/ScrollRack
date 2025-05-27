namespace Mtg_tracker.Models.DTOs;

public class UserReadDTO
{
    public required string Id { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public string? Profile { get; set; }
}