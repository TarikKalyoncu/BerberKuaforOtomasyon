using KuaforBerberOtomasyon.Enums;

namespace kuaforberberApp.Server.Models.DTO
{
    public class ServiceDto
    {
        public int ServiceID { get; set; }
        public string Name { get; set; }
        public int Duration { get; set; } 
        public decimal Price { get; set; }
        public string Gender { get; set; }
    }
}
