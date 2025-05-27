using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

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

    // TODO: Test protected api endpoints
    // GET: api/protected
    [Authorize]
    [HttpGet("protected")]
    public async Task<ActionResult<IEnumerable<UserReadDTO>>> GetUsersProtected()
    {
        var userId = User.Identity.Name;
        Console.WriteLine($"CLAIMS INFO: Name is --> {userId}");
        foreach (var claim in User.Claims)
        {
            Console.WriteLine($"{claim.Type} : {claim.Value}");
        }
        var users = await _context.Users.ToListAsync();
        return _mapper.Map<List<UserReadDTO>>(users);
    }

    // GET: api/User/id/1
    [HttpGet("id/{id}")]
    public async Task<ActionResult<UserReadDTO>> GetUserById(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return _mapper.Map<UserReadDTO>(user);
    }

    // GET: api/User/name/raymond
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
