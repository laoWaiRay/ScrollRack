using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;
using Mtg_tracker.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Mtg_tracker.Models.Errors;

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
public class UserController(MtgContext context, IMapper mapper) : ControllerBase
{
    private readonly MtgContext _context = context;
    private readonly IMapper _mapper = mapper;

    // GET: api/User/identity
    // Return the current user. Used for session verification.
    [Authorize]
    [HttpGet("identity")]
    public async Task<ActionResult<UserReadDTO>> Identity()
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

        return _mapper.Map<UserReadDTO>(user);
    }

    // // GET: api/User
    // // Get a list of all users
    // [HttpGet]
    // public async Task<ActionResult<IEnumerable<UserReadDTO>>> GetUsers()
    // {
    //     var users = await _context.Users.ToListAsync();
    //     return _mapper.Map<List<UserReadDTO>>(users);
    // }

    // POST: api/User
    // Get a list of all users corresponding to the given ids
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

        return NoContent();
    }

    // POST: api/user/register
    // Custom registration endpoint to be used instead of the default endpoint
    // created by Identity minimal API endpoints
    [HttpPost("register")]
    public async Task<ActionResult> Register(UserManager<ApplicationUser> userManager, UserRegisterDTO userRegisterDTO)
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

        return Ok();
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(SignInManager<ApplicationUser> signInManager, [FromBody] object empty)
    {
        if (empty != null)
        {
            await signInManager.SignOutAsync();
            return Ok();
        }
        return BadRequest();
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserReadDTO>> Login(SignInManager<ApplicationUser> signInManager, UserLoginDTO loginDTO)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDTO.Email);
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

        var result = await signInManager.PasswordSignInAsync(user.UserName, loginDTO.Password, true, false);
        if (!result.Succeeded)
        {
            return Unauthorized(errors);
        }

        return _mapper.Map<UserReadDTO>(user);
    }
}
