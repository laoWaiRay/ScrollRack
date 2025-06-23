// Join table for User, Deck, and Game
namespace Mtg_tracker.Models;

public class GameParticipation
{
    public int Id { get; set; }
    public int GameId { get; set; }
    public Game Game { get; set; } = null!;
    public required string UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;
    public int DeckId { get; set; }
    public Deck Deck { get; set; } = null!;

    public bool Won { get; set; }
    public DateTime CreatedAt { get; set; }
}