/*
 * Query this table to find all friend requests for a given user.
 * 
 * Includes computed columns for a database constraint to prevent duplicate
 * requests if A sends to B and B sends to A. Duplicates should also be
 * avoided at the Domain (API) level.
*/

namespace Mtg_tracker.Models;

public class FriendRequest
{
    public int Id { get; set; }
    public required string SenderId { get; set; }
    public required string ReceiverId { get; set; }
    public ApplicationUser Sender { get; set; } = null!;
    public ApplicationUser Receiver { get; set; } = null!;

    // Computed columns used only for uniqueness constraints
    public string User1 { get; set; } = null!;
    public string User2 { get; set; } = null!;
}