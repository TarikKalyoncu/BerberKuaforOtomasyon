namespace KuaforBerberOtomasyon.Models
{
    public class Employee
    {
        public int EmployeeID { get; set; }
        public string Name { get; set; }
        public TimeSpan StartTime { get; set; } //Sonra tasarlancak
        public TimeSpan EndTime { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Yabancı anahtarlar
        public ICollection<EmployeeService> EmployeeServices { get; set; } // Çalışanın hizmetleri

    }

}

