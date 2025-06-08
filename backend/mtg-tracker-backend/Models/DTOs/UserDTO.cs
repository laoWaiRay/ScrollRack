namespace Mtg_tracker.Models.DTOs;

public class UserReadDTO
{
    public required string Id { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; } // TODO: Remove email from DTO for production
    public string? Profile { get; set; }
}

// Used for updating user information
public class UserWriteDTO
{
    public required string Id { get; set; }
    public required string UserName { get; set; }
    public string? Profile { get; set; }
}

// Used for custom register endpoint
public class UserRegisterDTO
{
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class UserLoginDTO
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}