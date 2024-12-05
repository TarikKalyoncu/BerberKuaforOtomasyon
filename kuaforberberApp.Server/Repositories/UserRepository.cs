using kuaforberberApp.Server.Interface;
using kuaforberberApp.Server.Models; // Your custom User model
using kuaforberberApp.Server.Models.DTO;
using KuaforBerberOtomasyon.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace kuaforberberApp.Server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        public UserRepository(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Method to create a new user with a hashed password
        public async Task<User> CreateUserAsync(string email, string password)
        {
            var user = new User
            {
                UserID = 0,// Create a new unique ID
                Email = email,
                FullName = email // Assuming username is the email
            };

            // Hash the password manually (using SHA-256 here for simplicity, but you can use a more secure method like PBKDF2, bcrypt, etc.)
            user.PasswordHash = HashPassword(password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        // Method to get a user by email
        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        // Method to get a user by ID
        public async Task<User> GetUserByIdAsync(string userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        // Method to hash the password using SHA-256 (replace with more secure method in production)
        public string HashPassword(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                foreach (byte t in bytes)
                {
                    builder.Append(t.ToString("x2"));
                }
                return builder.ToString();
            }
        }

        public async Task<bool> SaveUserAsync(User user)
        {
            user.CreatedAt = user.CreatedAt.ToUniversalTime();
            _context.Users.Add(user);
            return await _context.SaveChangesAsync() > 0;
        }

        // Method to verify the password against the hashed password
        public bool VerifyPassword(string providedPassword, string hashedPassword)
        {
            return hashedPassword == HashPassword(providedPassword);
        }

        public string GenerateJwtToken(string userId, string userName, string email, string role)
        {
            var jwtKey = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var jwtAudience = _configuration["Jwt:Audience"];

            if (string.IsNullOrEmpty(jwtKey))
                throw new ArgumentNullException("Jwt:Key", "JWT key is missing from configuration.");

            // Claims
            var claims = new[]
            {
            new Claim("id", userId),
            new Claim("fullName", userName),
            new Claim("email", email),
            new Claim("role", role)
        };

            // Key and Credentials
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Token Descriptor
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = jwtIssuer,
                Audience = jwtAudience,
                SigningCredentials = credentials
            };

            // Token Handler
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            // Return the JWT as a string
            return tokenHandler.WriteToken(token);
        }
    }
}
