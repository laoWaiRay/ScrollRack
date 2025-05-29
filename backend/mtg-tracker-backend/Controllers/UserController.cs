using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;
using Mtg_tracker.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Data;

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

    // GET: api/User
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserReadDTO>>> GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        return _mapper.Map<List<UserReadDTO>>(users);
    }

    // GET: api/User/id/{id}
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

    // PUT: api/User/{id}
    // Edit username / profile picture
    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult> PutUser(string id, UserWriteDTO userWriteDTO)
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

        user.Profile = userWriteDTO.Profile;
        user.UserName = userWriteDTO.UserName;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict("Username already exists");
        }
        catch (DBConcurrencyException)
        {
            return StatusCode(500, "Error updating user details");
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

        return Ok();
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(SignInManager<ApplicationUser> signInManager, [FromBody] object empty)
    {
        if (empty != null)
        {
            await signInManager.SignOutAsync();
            return Ok();
        }
        return Unauthorized();
    }
}
