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
            .Property(snapshot => snapshot.CreatedAt)
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

        modelBuilder.Entity<User>()
            .HasMany(e => e.Friends)
            .WithMany();
    }
}