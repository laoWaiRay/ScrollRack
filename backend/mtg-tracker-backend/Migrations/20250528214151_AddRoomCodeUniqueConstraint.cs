using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mtg_tracker.Migrations
{
    /// <inheritdoc />
    public partial class AddRoomCodeUniqueConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "ix_rooms_code",
                table: "rooms",
                column: "code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_rooms_code",
                table: "rooms");
        }
    }
}
