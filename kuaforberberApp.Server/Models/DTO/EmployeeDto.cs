namespace kuaforberberApp.Server.Models.DTO
{
    public class EmployeeDto
    {
        public int? EmployeeID { get; set; }

        public string Name { get; set; }

        public string StartTime { get; set; } // HH:mm formatında gelmesi bekleniyor
        public string EndTime { get; set; }

        public string CreatedAt { get; set; } = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
    }
}
