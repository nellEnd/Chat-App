using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Chat_App_API.Migrations
{
    /// <inheritdoc />
    public partial class AddChatRoomAndRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PrivateChatRooms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    IsPrivate = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrivateChatRooms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PrivateChatRoomUser",
                columns: table => new
                {
                    ParticipantsId = table.Column<int>(type: "INTEGER", nullable: false),
                    PrivateChatRoomsId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrivateChatRoomUser", x => new { x.ParticipantsId, x.PrivateChatRoomsId });
                    table.ForeignKey(
                        name: "FK_PrivateChatRoomUser_PrivateChatRooms_PrivateChatRoomsId",
                        column: x => x.PrivateChatRoomsId,
                        principalTable: "PrivateChatRooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PrivateChatRoomUser_Users_ParticipantsId",
                        column: x => x.ParticipantsId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PrivateChatRoomUser_PrivateChatRoomsId",
                table: "PrivateChatRoomUser",
                column: "PrivateChatRoomsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PrivateChatRoomUser");

            migrationBuilder.DropTable(
                name: "PrivateChatRooms");
        }
    }
}
