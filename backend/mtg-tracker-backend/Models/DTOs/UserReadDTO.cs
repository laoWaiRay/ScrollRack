namespace Mtg_tracker.Models.DTOs;

public class UserReadDTO
{
    public required string Id { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; } // TODO: Remove email from DTO for production
    public string? Profile { get; set; }
}

public class UserWriteDTO
{
    public required string Id { get; set; }
    public required string UserName { get; set; }
    public string? Profile { get; set; }
}