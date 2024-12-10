namespace kuaforberberApp.Server.Models.DTO
{
    public class CreateAppointmentDTO
    {
        public string Gender { get; set; }
        public int ServiceID { get; set; }
        public int EmployeeID { get; set; }
        
        public string Time { get; set; }
        public string Date { get; set; }
        public int UserID { get; set; }


    }
}
