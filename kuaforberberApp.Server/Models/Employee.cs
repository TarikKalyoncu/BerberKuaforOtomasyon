namespace KuaforBerberOtomasyon.Models
{
    public class Employee
    {
        public int EmployeeID { get; set; }
        public string Name { get; set; }
        public string StartTime { get; set; } // HH:mm formatında
        public string EndTime { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Yabancı anahtarlar
        public ICollection<EmployeeService> EmployeeServices { get; set; } // Çalışanın hizmetleri

    }

}

