using KuaforBerberOtomasyon.Enums;
using System.ComponentModel.DataAnnotations;

namespace KuaforBerberOtomasyon.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public UserRole Role { get; set; } // Kullanıcının rolü (Admin, Employee, Customer)

        // Kullanıcının randevuları
        public ICollection<Appointment> Appointments { get; set; }
    }

}
