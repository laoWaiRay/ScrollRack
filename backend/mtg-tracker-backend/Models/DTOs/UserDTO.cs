namespace Mtg_tracker.Models.DTOs;

public class UserCreateDTO
{
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class UserUpdateDTO
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public string? Profile { get; set; }
}

public class UserReadDTO
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public string? Profile { get; set; }
}