using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PropertiesManagement.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Properties",
                columns: table => new
                {
                    PropertyId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Address = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Street = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Zip = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Latitude = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Longitude = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    City = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    State = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Type = table.Column<int>(type: "int", nullable: true),
                    Units = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: true),
                    OwnerId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    CreateAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    IsIDVerified = table.Column<bool>(type: "tinyint(1)", nullable: true),
                    LeaseExpirationDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    PayDay = table.Column<int>(type: "int", nullable: true),
                    DepostiAmount = table.Column<float>(type: "float", nullable: true),
                    RentAmount = table.Column<float>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Properties", x => x.PropertyId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PropertyDocuments",
                columns: table => new
                {
                    DocumentId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PropertyId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    DocumentURL = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Type = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyDocuments", x => x.DocumentId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "RentStatus",
                columns: table => new
                {
                    RentId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PropertyId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    TenantId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Amount = table.Column<float>(type: "float", nullable: false),
                    PaidOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    PaymentMode = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentStatus", x => x.RentId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TenantPropAssocs",
                columns: table => new
                {
                    TenantPropAssocId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    TenantId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PropertyId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    FromDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ToDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TenantPropAssocs", x => x.TenantPropAssocId);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Properties",
                columns: new[] { "PropertyId", "Address", "City", "CreateAt", "DepostiAmount", "IsIDVerified", "Latitude", "LeaseExpirationDate", "Longitude", "OwnerId", "PayDay", "RentAmount", "State", "Status", "Street", "Type", "Units", "Zip" },
                values: new object[,]
                {
                    { new Guid("08db29d5-2abd-421c-877c-1c976144321b"), "OLD 14 Dummy Street Dummy", "Dummy City", new DateTime(2023, 3, 27, 14, 35, 10, 801, DateTimeKind.Local).AddTicks(6315), 0f, true, null, new DateTime(2023, 3, 27, 14, 35, 10, 801, DateTimeKind.Local).AddTicks(6316), null, new Guid("08db29d3-b5b0-40f0-8ba1-e71ac088f927"), 5, 0f, "Dummy State", 0, null, 0, null, "12345" },
                    { new Guid("bc126543-a122-568b-7b1b-ba5882943098"), "OLD 12 Dummy Street Dummy", "Dummy City", new DateTime(2023, 3, 27, 14, 35, 10, 801, DateTimeKind.Local).AddTicks(6307), 0f, true, null, new DateTime(2023, 3, 27, 14, 35, 10, 801, DateTimeKind.Local).AddTicks(6308), null, new Guid("08db29d3-40d0-4898-858a-b279d3144b82"), 5, 0f, "Dummy State", 0, null, 0, null, "12345" },
                    { new Guid("cb987678-a122-568b-7b1b-ba5882943890"), "OLD 13 Dummy Street Dummy", "Dummy City", new DateTime(2023, 3, 27, 14, 35, 10, 801, DateTimeKind.Local).AddTicks(6311), 0f, true, null, new DateTime(2023, 3, 27, 14, 35, 10, 801, DateTimeKind.Local).AddTicks(6312), null, new Guid("08db29d3-b5b0-40f0-8ba1-e71ac088f927"), 5, 0f, "Dummy State", 0, null, 0, null, "12345" },
                    { new Guid("de785645-a122-568b-7b1b-ba5882943579"), "OLD 11 Dummy Street Dummy", "Dummy City", new DateTime(2023, 3, 27, 14, 35, 10, 801, DateTimeKind.Local).AddTicks(6285), 0f, true, null, new DateTime(2023, 3, 27, 14, 35, 10, 801, DateTimeKind.Local).AddTicks(6302), null, new Guid("08db29d3-40d0-4898-858a-b279d3144b82"), 5, 0f, "Dummy State", 0, null, 0, null, "12345" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Properties");

            migrationBuilder.DropTable(
                name: "PropertyDocuments");

            migrationBuilder.DropTable(
                name: "RentStatus");

            migrationBuilder.DropTable(
                name: "TenantPropAssocs");
        }
    }
}
