using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using KuaforBerberOtomasyon.Models;
using KuaforBerberOtomasyon.Enums;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using kuaforberberApp.Server.Interface.CodePulse.API.Repositories.Interface;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using kuaforberberApp.Server.Models.DTO;
using kuaforberberApp.Server.Interface;
using Microsoft.AspNetCore.Identity;

public class AuthController : ControllerBase
{
    private readonly ILogger<AuthController> _logger;
    private readonly ITokenRepository _tokenRepository;
    private readonly IUserRepository _userRepository;
 

    public AuthController(
        ILogger<AuthController> logger,
        ITokenRepository tokenRepository,
        IUserRepository userRepository)
    {
        _logger = logger;
        _tokenRepository = tokenRepository;
        _userRepository = userRepository;
 
    }

    [HttpPost("auth/register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        _logger.LogInformation("Register method started.");

        // Check if user already exists
        var existingUser = await _userRepository.GetUserByEmailAsync(request.Email?.Trim());
        if (existingUser != null)
        {
            _logger.LogWarning("User already exists with email: {Email}", request.Email);
            return BadRequest("User already exists");
        }

        var user = new User
        {
            FullName = request.FullName?.Trim() ?? "Default Name",
            Email = request.Email?.Trim(),
           
        };



        // Special admin user logic
        if (request.Email.Equals("tarik.kalyoncu1@ogr.sakarya.edu.tr", StringComparison.OrdinalIgnoreCase))
        {
            _logger.LogInformation("Special admin user detected: {Email}", request.Email);
            user.Role = UserRole.Admin; // Assign enum value
            user.PasswordHash = _userRepository.HashPassword("sau");
        }
        else
        {
            _logger.LogInformation("Normal user detected: {Email}", request.Email);
            user.Role = UserRole.Customer; // Assign enum value
            user.PasswordHash = _userRepository.HashPassword(request.Password?.Trim());
        }

        // Save user to database
        var result = await _userRepository.SaveUserAsync(user);
        if (result)
        {
            _logger.LogInformation("User created successfully.");

            // Generate JWT Token
            var roles = new List<string> { user.Role.ToString() }; // Convert enum to string
            var token = _tokenRepository.CreateJwtToken(user, roles);

            var response = new RegisterResponseDTO
            {
                Token = token,
                Password = request.Password
            };

            _logger.LogInformation("Returning registration success response.");
            return Ok(response);
        }
        else
        {
            _logger.LogError("Error creating user.");
            return BadRequest("Error creating user.");
        }
    }




    [HttpPost("auth/login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        _logger.LogInformation("Login method started.");

        // Check if user exists
        var user = await _userRepository.GetUserByEmailAsync(request.Email?.Trim());
        if (user == null)
        {
            _logger.LogWarning("User not found with email: {Email}", request.Email);
            return Unauthorized("Invalid email or password.");
        }

        // Validate password
        if (!_userRepository.VerifyPassword(request.Password?.Trim(), user.PasswordHash))
        {
            _logger.LogWarning("Invalid password for email: {Email}", request.Email);
            return Unauthorized("Invalid email or password.");
        }

        // Generate JWT token using user data
        var token = _userRepository.GenerateJwtToken(
            userId: user.UserID.ToString(),
            userName: user.FullName,
            email: user.Email,
            role: user.Role.ToString() // Enum to string conversion for role
        );

        // Create response
        var response = new LoginResponseDto
        {
            Token = token
        };

        _logger.LogInformation("Login successful for email: {Email}", request.Email);
        return Ok(response);
    }













}
