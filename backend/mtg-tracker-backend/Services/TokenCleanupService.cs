using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;

namespace Mtg_tracker.Services;

public class TokenCleanupService(MtgContext context)
{
    private readonly MtgContext _context = context;

    public async Task CleanupExpiredTokensAsync()
    {
        var now = DateTime.UtcNow;

        var expiredTokens = await _context.RefreshTokens
            .Where(t => t.ExpiresAt < now || t.IsRevoked)
            .ToListAsync();

        if (expiredTokens.Count > 0)
        {
            _context.RefreshTokens.RemoveRange(expiredTokens);
            await _context.SaveChangesAsync();
        }
    }
}