using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mtg_tracker.Migrations
{
    /// <inheritdoc />
    public partial class AddFriendRequestUniqueConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "user1",
                table: "friend_requests",
                type: "text",
                nullable: false,
                computedColumnSql: "LEAST(sender_id, receiver_id)",
                stored: true);

            migrationBuilder.AddColumn<string>(
                name: "user2",
                table: "friend_requests",
                type: "text",
                nullable: false,
                computedColumnSql: "GREATEST(sender_id, receiver_id)",
                stored: true);

            migrationBuilder.CreateIndex(
                name: "ix_friend_requests_user1_user2",
                table: "friend_requests",
                columns: new[] { "user1", "user2" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_friend_requests_user1_user2",
                table: "friend_requests");

            migrationBuilder.DropColumn(
                name: "user1",
                table: "friend_requests");

            migrationBuilder.DropColumn(
                name: "user2",
                table: "friend_requests");
        }
    }
}
