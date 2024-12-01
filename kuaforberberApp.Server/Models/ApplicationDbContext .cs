using Microsoft.EntityFrameworkCore;

namespace KuaforBerberOtomasyon.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<EmployeeService> EmployeeServices { get; set; }
    }
}
