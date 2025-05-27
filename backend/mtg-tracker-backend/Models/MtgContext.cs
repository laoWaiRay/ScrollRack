using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Mtg_tracker.Models;

public class MtgContext(DbContextOptions<MtgContext> options)
    : IdentityDbContext<ApplicationUser>(options)
{
    // No need for ApplicationUser DbSet (managed by Identity API)
    public DbSet<Deck> Decks { get; set; }
    public DbSet<FriendRequest> FriendRequests { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<GameParticipation> GameParticipations { get; set; }
    public DbSet<Room> Rooms { get; set; }
    public DbSet<StatSnapshot> StatSnapshots { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<StatSnapshot>()
            .Property(e => e.CreatedAt)
            .HasDefaultValueSql("NOW()");

        modelBuilder.Entity<Game>()
            .Property(e => e.CreatedAt)
            .HasDefaultValueSql("NOW()");

        modelBuilder.Entity<Room>()
            .Property(e => e.CreatedAt)
            .HasDefaultValueSql("NOW()");

        modelBuilder.Entity<FriendRequest>(
            nestedBuilder =>
            {
                nestedBuilder
                    .HasOne(e => e.Sender)
                    .WithMany(e => e.SentFriendRequests)
                    .HasForeignKey(e => e.SenderId);

                nestedBuilder
                    .HasOne(e => e.Receiver)
                    .WithMany(e => e.ReceivedFriendRequests)
                    .HasForeignKey(e => e.ReceiverId);
            }
        );

        // This models 'Friends' as a symmetrical unidirectional
        // many-to-many relationship - see FriendRequest.cs
        modelBuilder.Entity<ApplicationUser>()
            .HasMany(e => e.Friends)
            .WithMany();

        // Setting explicitly probably not needed? EF Core can probably discover
        // the relationships through convention
        modelBuilder.Entity<GameParticipation>(
            nestedBuilder =>
            {
                nestedBuilder
                    .HasOne(e => e.User)
                    .WithMany(e => e.GameParticipations)
                    .HasForeignKey(e => e.UserId);

                nestedBuilder
                    .HasOne(e => e.Deck)
                    .WithMany(e => e.GameParticipations)
                    .HasForeignKey(e => e.DeckId);

                nestedBuilder
                    .HasOne(e => e.Game)
                    .WithMany(e => e.GameParticipations)
                    .HasForeignKey(e => e.GameId);
            }
        );

        modelBuilder.Entity<Deck>(
            nestedBuilder =>
            {
                // Create uniqueness constraint on (UserId, Commander)
                nestedBuilder
                    .HasIndex(b => new { b.UserId, b.Commander })
                    .IsUnique();
            }
        );
    }
}