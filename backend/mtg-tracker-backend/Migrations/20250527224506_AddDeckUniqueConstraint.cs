using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mtg_tracker.Migrations
{
    /// <inheritdoc />
    public partial class AddDeckUniqueConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_decks_user_id",
                table: "decks");

            migrationBuilder.CreateIndex(
                name: "ix_decks_user_id_commander",
                table: "decks",
                columns: new[] { "user_id", "commander" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_decks_user_id_commander",
                table: "decks");

            migrationBuilder.CreateIndex(
                name: "ix_decks_user_id",
                table: "decks",
                column: "user_id");
        }
    }
}
