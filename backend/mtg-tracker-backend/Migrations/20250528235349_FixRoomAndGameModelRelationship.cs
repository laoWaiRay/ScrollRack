using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mtg_tracker.Migrations
{
    /// <inheritdoc />
    public partial class FixRoomAndGameModelRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_games_rooms_room_id",
                table: "games");

            migrationBuilder.DropIndex(
                name: "ix_games_room_id",
                table: "games");

            migrationBuilder.AlterColumn<int>(
                name: "room_id",
                table: "games",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.CreateIndex(
                name: "ix_games_room_id",
                table: "games",
                column: "room_id");

            migrationBuilder.AddForeignKey(
                name: "fk_games_rooms_room_id",
                table: "games",
                column: "room_id",
                principalTable: "rooms",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
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

            migrationBuilder.AlterColumn<int>(
                name: "room_id",
                table: "games",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

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
    }
}
