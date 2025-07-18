using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;
using Mtg_tracker.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Mtg_tracker.Models.Errors;
using Mtg_tracker.Services;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using System.Net.Mail;
using Google.Apis.Auth;

namespace Mtg_tracker.Controllers;

/* Endpoints related to authentication and authorization are created by
    * the Identity API:
    *
    * POST /register
    * POST /login
    * POST /refresh
    * GET /confirmEmail
    * POST /resendConfirmationEmail
    * POST /forgotPassword
    * POST /resetPassword
    * POST /manage/2fa
    * GET /manage/info
    * POST /manage/info
    *
    * For more info, see: https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-9.0#use-the-post-register-endpoint
*/
[Route("api/[controller]")]
[ApiController]
public class UserController(MtgContext context, IMapper mapper, ITemplatedEmailSender emailSender) : ControllerBase
{
    private readonly MtgContext _context = context;
    private readonly IMapper _mapper = mapper;
    private readonly ITemplatedEmailSender _emailSender = emailSender;

    // GET: api/User/email
    // Return the current user with email
    [Authorize]
    [HttpGet("email")]
    public async Task<ActionResult<UserWithEmailDTO>> GetUserWithEmail()
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var user = await _context.Users.FindAsync(userId);

        if (user is null)
        {
            return Unauthorized();
        }

        return _mapper.Map<UserWithEmailDTO>(user);
    }

    // POST: api/User
    // Get a list of all users corresponding to the given ids
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<IEnumerable<UserReadDTO>>> GetUsers(UserMultipleDTO userMultipleDTO)
    {
        List<ApplicationUser> userData = [];
        foreach (var userId in userMultipleDTO.Ids)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user != null)
            {
                userData.Add(user);
            }
        }
        return _mapper.Map<List<UserReadDTO>>(userData);
    }

    // GET: api/User/id/{id}
    // Get a specific user by id
    [Authorize]
    [HttpGet("id/{id}")]
    public async Task<ActionResult<UserReadDTO>> GetUserById(string id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return _mapper.Map<UserReadDTO>(user);
    }

    // GET: api/User/name/{username}
    // Get a specific user by username
    [Authorize]
    [HttpGet("name/{username}")]
    public async Task<ActionResult<UserReadDTO>> GetUserByName(string username)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);

        if (user == null)
        {
            return NotFound();
        }

        return _mapper.Map<UserReadDTO>(user);
    }

    // GET: api/User/{id}/decks
    // Get all decks for a specific user
    [Authorize]
    [HttpGet("{id}/decks")]
    public async Task<ActionResult<IEnumerable<DeckReadDTO>>> GetUserDecks(string id)
    {
        var user = await _context.Users
            .Include(u => u.Decks)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user is null)
        {
            return NotFound();
        }

        return _mapper.Map<List<DeckReadDTO>>(user.Decks);
    }

    // PUT: api/User/{id}
    // Edit username / profile picture
    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult> PutUser(UserManager<ApplicationUser> userManager, string id, UserWriteDTO userWriteDTO)
    {
        var userId = User.GetUserId();
        if (userId is null || userId != id)
        {
            return Unauthorized();
        }
        if (userWriteDTO.Id != id)
        {
            return BadRequest();
        }

        var user = await _context.Users.FindAsync(id);
        if (user is null)
        {
            return BadRequest();
        }

        // Handle only changing username and profile picture
        if (string.IsNullOrEmpty(userWriteDTO.CurrentPassword) || string.IsNullOrEmpty(userWriteDTO.NewPassword))
        {
            user.Profile = userWriteDTO.Profile;
            user.UserName = userWriteDTO.UserName;
            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            return NoContent();
        }


        // Otherwise, need to handle changing password, username and profile picture atomically.
        if (userWriteDTO.CurrentPassword == null)
        {
            return BadRequest();
        }

        // First check that the provided password is correct
        var passwordVerified = await userManager.CheckPasswordAsync(user, userWriteDTO.CurrentPassword);
        if (!passwordVerified)
        {
            var errors = new List<ErrorResponse> {
                new() {
                    Code = "IncorrectCurrentPassword",
                    Description = "Current password is incorrect"
                }
            };
            return BadRequest(errors);
        }

        // Check the new password passes validations
        var passwordValidator = new PasswordValidator<ApplicationUser>();
        var passwordResult = await passwordValidator.ValidateAsync(userManager, user, userWriteDTO.NewPassword);
        if (!passwordResult.Succeeded)
        {
            return BadRequest(passwordResult.Errors);
        }


        // Attempt to update everything except password
        user.Profile = userWriteDTO.Profile;
        user.UserName = userWriteDTO.UserName;

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            return BadRequest(updateResult.Errors);
        }

        // Finally, update the password with the new one that was already validated
        var passwordChangeResult = await userManager.ChangePasswordAsync(user, userWriteDTO.CurrentPassword, userWriteDTO.NewPassword);
        if (!passwordChangeResult.Succeeded)
        {
            return BadRequest(passwordChangeResult.Errors);
        }
        else
        {
            // Send an email confirmation that password was reset
            if (!string.IsNullOrEmpty(user.Email))
            {
                EmailTemplateContext emailContext = new()
                {

                    ToEmail = user.Email,
                    Type = EmailType.ResetPasswordConfirmation,
                    Variables = new ResetPasswordConfirmationVariables()
                    {
                        UserId = user.Id,
                        Name = user.UserName ?? "",
                    }
                };
                await _emailSender.SendEmailAsync(emailContext);
            }
        }

        return NoContent();
    }

    // POST: api/user/register
    // Custom registration endpoint to be used instead of the default endpoint
    // created by Identity minimal API endpoints
    [HttpPost("register")]
    public async Task<ActionResult<LoginResponseDTO>> Register(
        TokenProviderService tokenProvider,
        UserManager<ApplicationUser> userManager,
        UserRegisterDTO userRegisterDTO)
    {
        var user = new ApplicationUser
        {
            UserName = userRegisterDTO.UserName,
            Email = userRegisterDTO.Email,
        };

        var allErrors = new List<IdentityError>();

        foreach (var validator in userManager.UserValidators)
        {
            var result = await validator.ValidateAsync(userManager, user);
            if (!result.Succeeded)
            {
                allErrors.AddRange(result.Errors);
            }
        }

        foreach (var validator in userManager.PasswordValidators)
        {
            var result = await validator.ValidateAsync(userManager, user, userRegisterDTO.Password);
            if (!result.Succeeded)
            {
                allErrors.AddRange(result.Errors);
            }
        }

        if (allErrors.Count > 0)
        {
            return BadRequest(allErrors);
        }

        try
        {
            var result = await userManager.CreateAsync(user, userRegisterDTO.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Create initial empty stat snapshot
            user.StatSnapshot = new StatSnapshot
            {
                UserId = user.Id
            };

            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return BadRequest();
        }

        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var urlEncodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
        EmailTemplateContext emailContext = new()
        {
            ToEmail = user.Email,
            Type = EmailType.VerifyEmail,
            Variables = new VerifyEmailRequestVariables()
            {
                Name = user.UserName,
                UserId = user.Id,
                Token = urlEncodedToken
            }
        };
        await _emailSender.SendEmailAsync(emailContext);

        var accessToken = tokenProvider.CreateAccessToken(user);
        var refreshToken = await tokenProvider.CreateRefreshToken(user);
        return Ok(new LoginResponseDTO
        {
            UserData = _mapper.Map<UserWithEmailDTO>(user),
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(TokenProviderService tokenProvider, LogoutRequestDTO requestDTO)
    {
        await tokenProvider.InvalidateRefreshToken(requestDTO.RefreshToken);
        return Ok();
    }

    // Returns an access token that can be used to authenticate the user
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDTO>> Login(TokenProviderService tokenProvider, UserManager<ApplicationUser> userManager, UserLoginDTO loginDTO)
    {
        var user = await userManager.FindByEmailAsync(loginDTO.Email);
        List<ErrorResponse> errors = [
            new ErrorResponse
            {
                Code = "InvalidLoginCredentials",
                Description = "Invalid Email or Password"
            },
        ];

        if (user is null || user.UserName is null)
        {
            return Unauthorized(errors);
        }

        var loginResult = await userManager.CheckPasswordAsync(user, loginDTO.Password);

        if (!loginResult)
        {
            return Unauthorized(errors);
        }

        var accessToken = tokenProvider.CreateAccessToken(user);
        var refreshToken = await tokenProvider.CreateRefreshToken(user);
        return Ok(new LoginResponseDTO
        {
            UserData = _mapper.Map<UserWithEmailDTO>(user),
            AccessToken = accessToken,
            RefreshToken = refreshToken.Token
        });
    }


    [HttpPost("refresh")]
    public async Task<ActionResult<RefreshResponseDTO>> Refresh(TokenProviderService tokenProvider, RefreshRequestDTO request)
    {
        var refreshToken = request.RefreshToken;
        var user = await tokenProvider.ValidateRefreshToken(refreshToken);
        if (user == null)
        {
            return Unauthorized();
        }

        // Invalidate old refresh token
        await tokenProvider.InvalidateRefreshToken(refreshToken);

        var newAccessToken = tokenProvider.CreateAccessToken(user);
        var newRefreshToken = await tokenProvider.CreateRefreshToken(user);

        return Ok(new RefreshResponseDTO()
        {
            UserData = _mapper.Map<UserWithEmailDTO>(user),
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken.Token
        });
    }


    [HttpPost("resend-verify-email-link")]
    [Authorize]
    public async Task<IActionResult> ResendVerifyEmailLink(UserManager<ApplicationUser> userManager)
    {
        var userId = User.GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return BadRequest();
        }

        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var urlEncodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
        EmailTemplateContext emailContext = new()
        {
            ToEmail = user.Email ?? "",
            Type = EmailType.VerifyEmail,
            Variables = new VerifyEmailRequestVariables()
            {
                Name = user.UserName ?? "",
                UserId = user.Id,
                Token = urlEncodedToken
            }

        };
        await _emailSender.SendEmailAsync(emailContext);

        return Ok();
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail(UserManager<ApplicationUser> userManager,
        [FromQuery] string id, [FromQuery] string token)
    {
        if (string.IsNullOrEmpty(id) || string.IsNullOrEmpty(token))
        {
            return BadRequest("Missing user ID or token.");
        }

        var user = await userManager.FindByIdAsync(id);
        if (user is null)
        {
            return NotFound("User not found");
        }

        try
        {
            var tokenBytes = WebEncoders.Base64UrlDecode(token);
            var urlDecodedToken = Encoding.UTF8.GetString(tokenBytes);
            var result = await userManager.ConfirmEmailAsync(user, urlDecodedToken);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("Email verified");
        }
        catch (FormatException)
        {
            return BadRequest("Invalid token format");
        }
    }

    [HttpPost("send-password-reset")]
    public async Task<IActionResult> SendPasswordReset(UserManager<ApplicationUser> userManager, ForgotPasswordRequestDTO request)
    {
        try
        {
            var emailAddress = new MailAddress(request.Email);
        }
        catch
        {
            ErrorResponse[] errors = [
                 new ErrorResponse {
                    Code = "InvalidEmail",
                    Description = "Invalid Email Format"
                }
             ];
            return BadRequest(errors);
        }

        var normalizedEmail = userManager.NormalizeEmail(request.Email);
        var user = await _context.Users.FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail);

        if (user is null || user.Email is null)
        {
            return Ok();
        }

        var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
        var urlEncodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(resetToken));

        EmailTemplateContext emailContext = new()
        {

            ToEmail = user.Email,
            Type = EmailType.ForgotPassword,
            Variables = new ForgotPasswordRequestVariables()
            {
                UserId = user.Id,
                Token = urlEncodedToken
            }
        };
        await _emailSender.SendEmailAsync(emailContext);

        return Ok();
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(UserManager<ApplicationUser> userManager,
        ResetPasswordRequestDTO request)
    {
        var id = request.Id;
        var token = request.Token;
        var newPassword = request.Password;

        if (string.IsNullOrEmpty(id) || string.IsNullOrEmpty(token))
        {
            return BadRequest("Missing user ID or token.");
        }

        var user = await userManager.FindByIdAsync(id);
        if (user is null)
        {
            return NotFound("User not found");
        }

        try
        {
            var tokenBytes = WebEncoders.Base64UrlDecode(token);
            var urlDecodedToken = Encoding.UTF8.GetString(tokenBytes);
            var result = await userManager.ResetPasswordAsync(user, urlDecodedToken, newPassword);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Invalidate all sessions for user
            await userManager.UpdateSecurityStampAsync(user);

            // Send an email confirmation that password was reset
            if (!string.IsNullOrEmpty(user.Email))
            {
                var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
                var urlEncodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(resetToken));

                EmailTemplateContext emailContext = new()
                {

                    ToEmail = user.Email,
                    Type = EmailType.ResetPasswordConfirmation,
                    Variables = new ResetPasswordConfirmationVariables()
                    {
                        UserId = user.Id,
                        Name = user.UserName ?? "",
                    }
                };
                await _emailSender.SendEmailAsync(emailContext);
            }

            return Ok("Password successfully reset");
        }
        catch (FormatException)
        {
            return BadRequest("Invalid token format");
        }
    }

    [HttpPost("auth/google")]
    public async Task<ActionResult<LoginResponseDTO>> GoogleLogin(
        IConfiguration configuration,
        GoogleLoginRequestDTO request,
        UserManager<ApplicationUser> userManager,
        TokenProviderService tokenProvider)
    {
        if (string.IsNullOrWhiteSpace(request.IdToken))
        {
            return BadRequest("No Google ID token");
        }

        string? email;
        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = [configuration["Authentication_Google_ClientId"]]
            });

            email = payload?.Email;
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest();
            }

        }
        catch (InvalidJwtException)
        {
            return BadRequest();
        }

        var user = await userManager.FindByEmailAsync(email);

        if (user == null)
        {
            user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true,
            };

            var createResult = await userManager.CreateAsync(user);

            if (!createResult.Succeeded)
            {
                return BadRequest(createResult.Errors);
            }

            user.StatSnapshot = new StatSnapshot()
            {
                UserId = user.Id,
            };
            await _context.SaveChangesAsync(); // Save the new StatSnapshot
        }

        string accessToken = tokenProvider.CreateAccessToken(user);
        string refreshToken = (await tokenProvider.CreateRefreshToken(user)).Token;
        return Ok(new LoginResponseDTO
        {
            UserData = _mapper.Map<UserWithEmailDTO>(user),
            AccessToken = accessToken,
            RefreshToken = refreshToken,
        });
    }
}
