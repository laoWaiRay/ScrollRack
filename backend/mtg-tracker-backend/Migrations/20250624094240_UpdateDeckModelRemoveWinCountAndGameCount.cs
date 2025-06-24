using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mtg_tracker.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDeckModelRemoveWinCountAndGameCount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "num_games",
                table: "decks");

            migrationBuilder.DropColumn(
                name: "num_wins",
                table: "decks");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "num_games",
                table: "decks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "num_wins",
                table: "decks",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
