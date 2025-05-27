using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;
using Mtg_tracker.Models.DTOs;
using AutoMapper;

namespace Mtg_tracker.Controllers
{
    // TODO: Add protected routes and authentication/authorization logic for GET, PUT, and DELETE actions
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
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                return NotFound();
            }

            return _mapper.Map<UserReadDTO>(user);
        }

        // PUT: api/User/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserUpdateDTO userUpdateDTO)
        {
            if (id != userUpdateDTO.Id)
            {
                return BadRequest();
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.Username = userUpdateDTO.Username;
            user.Password = userUpdateDTO.Password;
            user.Email = userUpdateDTO.Email;
            user.Profile = userUpdateDTO.Profile;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!UserExists(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/User
        [HttpPost]
        public async Task<ActionResult<UserReadDTO>> PostUser(UserCreateDTO userCreateDTO)
        {
            // TODO: Validate username, password, email before saving to DB

            var user = _mapper.Map<User>(userCreateDTO);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserById", new { id = user.Id }, user);
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
