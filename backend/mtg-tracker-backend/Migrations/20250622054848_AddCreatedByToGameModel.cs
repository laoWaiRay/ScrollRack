using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mtg_tracker.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedByToGameModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "created_by_user_id",
                table: "games",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "ix_games_created_by_user_id",
                table: "games",
                column: "created_by_user_id");

            migrationBuilder.AddForeignKey(
                name: "fk_games_asp_net_users_created_by_user_id",
                table: "games",
                column: "created_by_user_id",
                principalTable: "AspNetUsers",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_games_asp_net_users_created_by_user_id",
                table: "games");

            migrationBuilder.DropIndex(
                name: "ix_games_created_by_user_id",
                table: "games");

            migrationBuilder.DropColumn(
                name: "created_by_user_id",
                table: "games");
        }
    }
}
