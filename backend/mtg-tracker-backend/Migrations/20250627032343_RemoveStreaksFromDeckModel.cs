using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mtg_tracker.Migrations
{
    /// <inheritdoc />
    public partial class RemoveStreaksFromDeckModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "longest_loss_streak",
                table: "decks");

            migrationBuilder.DropColumn(
                name: "longest_win_streak",
                table: "decks");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "longest_loss_streak",
                table: "decks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "longest_win_streak",
                table: "decks",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
