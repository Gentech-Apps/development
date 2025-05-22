using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UserManagement.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    CompanyId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    OwnerId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    CompanyName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.CompanyId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "OTPVerifications",
                columns: table => new
                {
                    OTPId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UserId = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OPT = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OTPVerifications", x => x.OTPId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Email = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordSalt = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsPhoneNoVerified = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Role = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UsersInfo",
                columns: table => new
                {
                    UserinfoId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    FirstName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Mobile = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsMobileVerified = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ProfileImageURL = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ReceiveNotificationOnEmail = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    ReceiveNotificationOnSMS = table.Column<bool>(type: "tinyint(1)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsersInfo", x => x.UserinfoId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Companies",
                columns: new[] { "CompanyId", "CompanyName", "CreatedAt", "OwnerId" },
                values: new object[,]
                {
                    { new Guid("08dc5678-b5b0-40f0-8ba1-1a3ed088f978"), "Test Company Ltd", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new Guid("08db29d3-40d0-4898-858a-b279d3144b82") },
                    { new Guid("08fe0990-b5b0-40f0-8ba1-1a3ed01a5d6f"), "Test Company Ltd", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new Guid("08db29d2-b133-4cf8-805e-4f63083effca") }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Email", "IsActive", "IsPhoneNoVerified", "PasswordHash", "PasswordSalt", "Role" },
                values: new object[,]
                {
                    { new Guid("08db29d2-b133-4cf8-805e-4f63083effca"), "admin@sre.com", true, true, "4S4FM9oK1TX8+FfwRQQ1e3zNZBQ56DS95dlARY4xhFE=", "kBVsQEMksvH1P58ZOIHa1g==", "admin" },
                    { new Guid("08db29d3-40d0-4898-858a-b279d3144b82"), "test1@sre.com", true, true, "4S4FM9oK1TX8+FfwRQQ1e3zNZBQ56DS95dlARY4xhFE=", "kBVsQEMksvH1P58ZOIHa1g==", "landlord" },
                    { new Guid("08db29d3-b5b0-40f0-8ba1-e71ac088f927"), "test2@sre.com", true, true, "4S4FM9oK1TX8+FfwRQQ1e3zNZBQ56DS95dlARY4xhFE=", "kBVsQEMksvH1P58ZOIHa1g==", "landlord" }
                });

            migrationBuilder.InsertData(
                table: "UsersInfo",
                columns: new[] { "UserinfoId", "CreatedAt", "FirstName", "IsMobileVerified", "LastName", "Mobile", "ProfileImageURL", "ReceiveNotificationOnEmail", "ReceiveNotificationOnSMS", "UserId" },
                values: new object[,]
                {
                    { 1, null, "Admin", null, "Admin", "", "", null, null, new Guid("08db29d2-b133-4cf8-805e-4f63083effca") },
                    { 2, null, "Test", null, "User1", "+11111111111", "", null, null, new Guid("08db29d3-40d0-4898-858a-b279d3144b82") },
                    { 3, null, "Test", null, "User2", "+12222222222", "", null, null, new Guid("08db29d3-b5b0-40f0-8ba1-e71ac088f927") }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "OTPVerifications");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "UsersInfo");
        }
    }
}
