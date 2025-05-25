// Join table for User, Deck, and Game
namespace Mtg_tracker.Models;

public class GameParticipation
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int GameId { get; set; }
    public Game Game { get; set; } = null!;
    public int DeckId { get; set; }
    public Deck Deck { get; set; } = null!;

    public bool Won { get; set; }
}