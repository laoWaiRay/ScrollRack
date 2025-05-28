// Doesn't exist, FriendRequest data will never need to be sent directly
// between server/client.

namespace Mtg_tracker.Models.DTOs;

public class FriendRequestDTO
{
    public int Id { get; set; }
    public required string SenderId { get; set; }
    public required string ReceiverId { get; set; }
}