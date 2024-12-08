using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kuaforberberApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCre1ate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "StartTime",
                table: "Employees",
                type: "text",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "interval");

            migrationBuilder.AlterColumn<string>(
                name: "EndTime",
                table: "Employees",
                type: "text",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "interval");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<TimeSpan>(
                name: "StartTime",
                table: "Employees",
                type: "interval",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "EndTime",
                table: "Employees",
                type: "interval",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
