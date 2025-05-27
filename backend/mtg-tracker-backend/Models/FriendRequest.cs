/*
 * Query this table to find all friend requests for a given user.
 * 
 * Sample SQL Queries (must convert into LINQ)
 *
 * 1) User 10 sends a friend request to user 15
 * INSERT INTO friend_request (uid1, uid2)
 * VALUES (10, 15);
 *
 * 2) Get all friend requests for user 15
 * SELECT * FROM requestor
 * WHERE (uid1 = 15 AND requester = 'uid2') OR
 *       (uid2 = 15 AND requestor = 'uid1');
 *
 * Retrieving friends is done using the EF Core "Symmetrical self-referencing
 * many-to-many" relationship:
 * https://learn.microsoft.com/en-us/ef/core/modeling/relationships/many-to-many#symmetrical-self-referencing-many-to-many
 *
 * NOTE: When adding or removing friends, must add/remove twice, e.g.:
 *
 *     ginny.Friends.Add(hermione);
 *     hermione.Friends.Add(ginny);
 *
 * This is because it is a unidirectional many-to-many relationship.
*/

namespace Mtg_tracker.Models;

public class FriendRequest
{
    public int Id { get; set; }
    public required string SenderId { get; set; }
    public required string ReceiverId { get; set; }
    public ApplicationUser Sender { get; set; } = null!;
    public ApplicationUser Receiver { get; set; } = null!;
}