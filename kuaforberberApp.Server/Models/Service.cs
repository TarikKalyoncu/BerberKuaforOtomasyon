using KuaforBerberOtomasyon.Enums;

namespace KuaforBerberOtomasyon.Models
{
    public class Service
    {
        public int ServiceID { get; set; }
        public string Name { get; set; } // Enum kullanımı
        public int Duration { get; set; } // Dakika cinsinden
        public decimal Price { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public string Gender { get; set; }

        // Yabancı anahtarlar

        public ICollection<EmployeeService> EmployeeServices { get; set; } // Hizmetin çalışanları

    }

}
