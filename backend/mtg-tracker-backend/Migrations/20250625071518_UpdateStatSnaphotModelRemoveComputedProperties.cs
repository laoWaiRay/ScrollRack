using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mtg_tracker.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStatSnaphotModelRemoveComputedProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "current_loss_streak",
                table: "stat_snapshots");

            migrationBuilder.DropColumn(
                name: "current_win_streak",
                table: "stat_snapshots");

            migrationBuilder.DropColumn(
                name: "games_played",
                table: "stat_snapshots");

            migrationBuilder.DropColumn(
                name: "games_won",
                table: "stat_snapshots");

            migrationBuilder.DropColumn(
                name: "num_decks",
                table: "stat_snapshots");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "current_loss_streak",
                table: "stat_snapshots",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "current_win_streak",
                table: "stat_snapshots",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "games_played",
                table: "stat_snapshots",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "games_won",
                table: "stat_snapshots",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "num_decks",
                table: "stat_snapshots",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
