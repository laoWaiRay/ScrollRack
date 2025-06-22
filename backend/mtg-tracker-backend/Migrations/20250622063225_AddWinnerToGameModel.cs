using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mtg_tracker.Migrations
{
    /// <inheritdoc />
    public partial class AddWinnerToGameModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "winner_id",
                table: "games",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "ix_games_winner_id",
                table: "games",
                column: "winner_id");

            migrationBuilder.AddForeignKey(
                name: "fk_games_users_winner_id",
                table: "games",
                column: "winner_id",
                principalTable: "AspNetUsers",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_games_users_winner_id",
                table: "games");

            migrationBuilder.DropIndex(
                name: "ix_games_winner_id",
                table: "games");

            migrationBuilder.DropColumn(
                name: "winner_id",
                table: "games");
        }
    }
}
