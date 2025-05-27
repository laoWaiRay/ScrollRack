using Microsoft.EntityFrameworkCore;
using Mtg_tracker.Models;

namespace Mtg_tracker.Extensions;

public static class MtgContextExtensions
{
    public static async Task<bool> UserExists(this MtgContext context, string id)
    {
        return await context.Users.AnyAsync(u => u.Id == id);
    }
}