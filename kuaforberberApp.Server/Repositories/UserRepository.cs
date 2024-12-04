using kuaforberberApp.Server.Interface;
using kuaforberberApp.Server.Models; // Your custom User model
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace kuaforberberApp.Server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
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
        public bool VerifyPassword(string hashedPassword, string providedPassword)
        {
            return hashedPassword == HashPassword(providedPassword);
        }
    }
}
