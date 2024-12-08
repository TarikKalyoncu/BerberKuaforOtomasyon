namespace kuaforberberApp.Server.Models.DTO
{
    public class EmployeeUpdateDto
    {
        public string Name { get; set; }
        public string StartTime { get; set; } // HH:mm formatında
        public string EndTime { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
