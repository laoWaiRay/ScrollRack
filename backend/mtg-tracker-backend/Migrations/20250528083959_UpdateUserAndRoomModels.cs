using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mtg_tracker.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserAndRoomModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "room_owner_id",
                table: "rooms",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "joined_room_id",
                table: "AspNetUsers",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_rooms_room_owner_id",
                table: "rooms",
                column: "room_owner_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_users_joined_room_id",
                table: "AspNetUsers",
                column: "joined_room_id");

            migrationBuilder.AddForeignKey(
                name: "fk_asp_net_users_rooms_joined_room_id",
                table: "AspNetUsers",
                column: "joined_room_id",
                principalTable: "rooms",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "fk_rooms_asp_net_users_room_owner_id",
                table: "rooms",
                column: "room_owner_id",
                principalTable: "AspNetUsers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_asp_net_users_rooms_joined_room_id",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "fk_rooms_asp_net_users_room_owner_id",
                table: "rooms");

            migrationBuilder.DropIndex(
                name: "ix_rooms_room_owner_id",
                table: "rooms");

            migrationBuilder.DropIndex(
                name: "ix_asp_net_users_joined_room_id",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "room_owner_id",
                table: "rooms");

            migrationBuilder.DropColumn(
                name: "joined_room_id",
                table: "AspNetUsers");
        }
    }
}
