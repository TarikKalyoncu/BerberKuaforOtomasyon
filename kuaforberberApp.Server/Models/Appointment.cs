using KuaforBerberOtomasyon.Enums;

namespace KuaforBerberOtomasyon.Models
{
    public class Appointment
    {
        public int AppointmentID { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public AppointmentStatus Status { get; set; } // Enum kullanılıyor
        public decimal TotalPrice { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Yabancı anahtarlar
        public int UserID { get; set; }
        public User User { get; set; }

        public int EmployeeID { get; set; }
        public Employee Employee { get; set; }

        public int ServiceID { get; set; }
        public Service Service { get; set; }
    }


}
