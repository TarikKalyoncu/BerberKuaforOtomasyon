using kuaforberberApp.Server.Models.DTO;
using KuaforBerberOtomasyon.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace kuaforberberApp.Server.Controllers
{
    [ApiController]
     
    public class EmployeesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<EmployeesController> _logger;

        public EmployeesController(ApplicationDbContext context, ILogger<EmployeesController> logger)
        {
            _context = context;
            _logger = logger;
        }


        [HttpGet("api/employees")]
        public async Task<IActionResult> GetEmployees()
        {
            var employees = await _context.Employees.ToListAsync();
            return Ok(employees);
        }

        [HttpPost("api/employees")]
        public async Task<IActionResult> AddEmployee([FromBody] EmployeeDto employeeDto)
        {
            if (employeeDto == null)
            {
                _logger.LogWarning("Attempted to add a null employee object.");
                return BadRequest("Employee data is required.");
            }

            _logger.LogInformation("Adding new employee: {@EmployeeDto}", employeeDto);

            try
            {
                // DTO'dan Entity'ye dönüştürme işlemi
                var employee = new Employee
                {
                    Name = employeeDto.Name,
                    StartTime = employeeDto.StartTime,
                    EndTime = employeeDto.EndTime,
                    CreatedAt = DateTime.UtcNow // UTC olarak ayarlandı
                };

                _context.Employees.Add(employee);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Employee added successfully with ID: {EmployeeID}", employee.EmployeeID);

                return CreatedAtAction(nameof(GetEmployees), new { id = employee.EmployeeID }, employee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while adding the employee.");
                return StatusCode(500, "Internal server error");
            }
        }




        [HttpPut("api/employees/{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] EmployeeUpdateDto employeeDto)
        {
            if (employeeDto == null)
            {
                return BadRequest("Employee data is required.");
            }

            // Veritabanından ilgili çalışan kaydını alın
            var existingEmployee = await _context.Employees.FindAsync(id);
            if (existingEmployee == null)
            {
                return NotFound($"Employee with ID {id} not found.");
            }

            // DTO'dan gelen verileri mevcut modele aktar
            existingEmployee.Name = employeeDto.Name;
            existingEmployee.StartTime = employeeDto.StartTime;
            existingEmployee.EndTime = employeeDto.EndTime;
            existingEmployee.CreatedAt = employeeDto.CreatedAt;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                // Veritabanı güncelleme hatalarını yakalayın
                return StatusCode(500, $"An error occurred while updating the employee: {ex.Message}");
            }
        }


        [HttpDelete("api/employees/{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

}
