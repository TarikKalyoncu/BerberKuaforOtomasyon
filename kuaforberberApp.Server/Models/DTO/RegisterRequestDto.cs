namespace kuaforberberApp.Server.Models.DTO
{
    public class RegisterRequestDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; } // Added UserName for a complete user registration
    }
}
