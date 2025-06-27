using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mtg_tracker.Migrations
{
    /// <inheritdoc />
    public partial class RemoveStreaksFromStatSnapshotModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "longest_loss_streak",
                table: "stat_snapshots");

            migrationBuilder.DropColumn(
                name: "longest_win_streak",
                table: "stat_snapshots");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "longest_loss_streak",
                table: "stat_snapshots",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "longest_win_streak",
                table: "stat_snapshots",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
