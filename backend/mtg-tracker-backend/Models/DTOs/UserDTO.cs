namespace Mtg_tracker.Models.DTOs;

public class UserWithEmailDTO
{
    public required string Email { get; set; }
    public required bool EmailConfirmed { get; set; }
    public required string Id { get; set; }
    public required string UserName { get; set; }
    public string? Profile { get; set; }
    public required List<DeckReadDTO> Decks { get; set; } = [];
}

public class UserReadDTO
{
    public required string Id { get; set; }
    public required string UserName { get; set; }
    public string? Profile { get; set; }
    public required List<DeckReadDTO> Decks { get; set; } = [];
}

public class UserReadMinimalDTO
{
    public required string Id { get; set; }
    public required string UserName { get; set; }
    public string? Profile { get; set; }
}

public class UserWriteDTO
{
    public required string Id { get; set; }
    public required string UserName { get; set; }
    public string? CurrentPassword { get; set; }
    public string? NewPassword { get; set; }
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

// Used for adding friends without request
public class UserFriendAddDTO
{
    public required string Id { get; set; }
    public required bool RequiresPermission { get; set; }
}

public class UserMultipleDTO
{
    public required string[] Ids { get; set; }
}

public class ForgotPasswordRequestDTO
{
    public required string Email { get; set; }
}

public class ResetPasswordRequestDTO
{
    public required string Id { get; set; }
    public required string Token { get; set; }
    public required string Password { get; set; }
}

public class LoginResponseDTO
{
    public required UserWithEmailDTO UserData { get; set; }
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}

public class RefreshRequestDTO
{
    public required string RefreshToken { get; set; }
}

public class RefreshResponseDTO
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}