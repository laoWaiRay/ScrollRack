using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Mtg_tracker.Models;

namespace Mtg_tracker.Services;

public class TokenProviderService(IConfiguration configuration, MtgContext context)
{
    private readonly MtgContext _context = context;

    public string CreateAccessToken(ApplicationUser user)
    {
        string secretKey = configuration["Jwt:Secret"]!;

        var claims = new[] {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new Claim("email_verified", user.EmailConfirmed.ToString()),
        };

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<RefreshToken> CreateRefreshToken(ApplicationUser user)
    {
        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            Token = Guid.NewGuid().ToString(),
            IsRevoked = false,
        };

        _context.RefreshTokens.Add(refreshToken);

        // Remove old refresh tokens
        var activeTokens = _context.RefreshTokens
            .Where(rt => rt.UserId == user.Id && !rt.IsRevoked && rt.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(rt => rt.CreatedAt)
            .Skip(5); // keep last 5

        if (activeTokens.Any())
        {
            _context.RefreshTokens.RemoveRange(activeTokens);
            await _context.SaveChangesAsync();
        }

        return refreshToken;
    }

    public async Task<ApplicationUser?> ValidateRefreshToken(string refreshToken)
    {
        var token = await _context.RefreshTokens
            .Where(rt => rt.Token == refreshToken && !rt.IsRevoked && rt.ExpiresAt > DateTime.UtcNow)
            .FirstOrDefaultAsync();

        if (token == null)
        {
            return null;
        }

        return await _context.Users.FindAsync(token.UserId);
    }

    public async Task InvalidateRefreshToken(string token)
    {
        var rt = await _context.RefreshTokens.FirstOrDefaultAsync(r => r.Token == token);
        if (rt != null)
        {
            rt.IsRevoked = true;
            await _context.SaveChangesAsync();
        }
    }
}