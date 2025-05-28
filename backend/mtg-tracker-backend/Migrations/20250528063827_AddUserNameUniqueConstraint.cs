using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mtg_tracker.Migrations
{
    /// <inheritdoc />
    public partial class AddUserNameUniqueConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "ix_asp_net_users_user_name",
                table: "AspNetUsers",
                column: "user_name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_asp_net_users_user_name",
                table: "AspNetUsers");
        }
    }
}
