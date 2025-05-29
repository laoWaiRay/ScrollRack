using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mtg_tracker.Migrations
{
    /// <inheritdoc />
    public partial class AddGameParticipationUniqueConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_game_participations_deck_id",
                table: "game_participations");

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "game_participations",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW()");

            migrationBuilder.CreateIndex(
                name: "ix_game_participations_deck_id_game_id",
                table: "game_participations",
                columns: new[] { "deck_id", "game_id" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_game_participations_deck_id_game_id",
                table: "game_participations");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "game_participations");

            migrationBuilder.CreateIndex(
                name: "ix_game_participations_deck_id",
                table: "game_participations",
                column: "deck_id");
        }
    }
}
