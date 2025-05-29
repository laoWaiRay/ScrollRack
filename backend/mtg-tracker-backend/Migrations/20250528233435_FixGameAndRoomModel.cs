using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mtg_tracker.Migrations
{
    /// <inheritdoc />
    public partial class FixGameAndRoomModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_rooms_games_game_id",
                table: "rooms");

            migrationBuilder.DropIndex(
                name: "ix_rooms_game_id",
                table: "rooms");

            migrationBuilder.DropColumn(
                name: "game_id",
                table: "rooms");

            migrationBuilder.AddColumn<int>(
                name: "room_id",
                table: "games",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "ix_games_room_id",
                table: "games",
                column: "room_id",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_games_rooms_room_id",
                table: "games",
                column: "room_id",
                principalTable: "rooms",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_games_rooms_room_id",
                table: "games");

            migrationBuilder.DropIndex(
                name: "ix_games_room_id",
                table: "games");

            migrationBuilder.DropColumn(
                name: "room_id",
                table: "games");

            migrationBuilder.AddColumn<int>(
                name: "game_id",
                table: "rooms",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "ix_rooms_game_id",
                table: "rooms",
                column: "game_id",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "fk_rooms_games_game_id",
                table: "rooms",
                column: "game_id",
                principalTable: "games",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
