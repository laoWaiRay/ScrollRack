using Microsoft.EntityFrameworkCore;

namespace Mtg_tracker.Models;

public class MtgContext(DbContextOptions<MtgContext> options)
    : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<StatSnapshot> StatSnapshots { get; set; }
    public DbSet<FriendRequest> FriendRequests { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
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
                    .HasOne(e => e.User1)
                    .WithMany()
                    .HasForeignKey(e => e.Uid1);

                nestedBuilder
                    .HasOne(e => e.User2)
                    .WithMany()
                    .HasForeignKey(e => e.Uid2);

                nestedBuilder
                    .ToTable(b => b.HasCheckConstraint("CK_Uid_Order", "uid1 < uid2"));
            }
        );

        // This models 'Friends' as a symmetrical unidirectional
        // many-to-many relationship - see FriendRequest.cs
        modelBuilder.Entity<User>()
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
    }
}