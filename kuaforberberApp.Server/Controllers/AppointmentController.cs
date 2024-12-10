using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using KuaforBerberOtomasyon.Models;
using KuaforBerberOtomasyon.Enums;
using kuaforberberApp.Server.Models.DTO;

namespace kuaforberberApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AppointmentController> _logger;

        public AppointmentController(ApplicationDbContext context, ILogger<AppointmentController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // API endpoint: Get appointments for a specific employee on a specific date
        [HttpGet("appointments/employee/{employeeId}/date/{date}")]
        public async Task<IActionResult> GetAppointmentsForEmployee(int employeeId, string date)
        {
            // Convert string date to DateTime
            if (!DateTime.TryParse(date, out DateTime parsedDate))
            {
                return BadRequest("Invalid date format.");
            }
            parsedDate = DateTime.SpecifyKind(parsedDate, DateTimeKind.Utc);
            // Fetch appointments for the employee on the given date with related User and Service data
            var appointments = await _context.Appointments
                .Where(a => a.EmployeeID == employeeId && a.AppointmentDate.Date == parsedDate.Date)
                .Include(a => a.User)    // Eager loading to include related User data
                .Include(a => a.Service) // Eager loading to include related Service data
                .Include(a => a.Employee) // Eager loading to include related Employee data
                .Select(a => new
                {
                    a.AppointmentID,
                    a.AppointmentDate,
                    a.StartTime,
                    a.EndTime,
                    a.Status,
                    a.TotalPrice,
                    UserID = a.UserID,  // Corrected to UserID
                    ServiceID = a.ServiceID, // Corrected to ServiceID
                    EmployeeID = a.EmployeeID  // Corrected to EmployeeID
                })
                .ToListAsync();

            if (appointments == null || appointments.Count == 0)
            {
                _logger.LogWarning("No appointments found for employeeId: {EmployeeId} on date: {Date}", employeeId, parsedDate);
                return NotFound("No appointments found.");
            }

            _logger.LogInformation("Appointments found for employeeId: {EmployeeId} on date: {Date}", employeeId, parsedDate);
            return Ok(appointments);
        }



        [HttpPost("appointments")]
        public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentDTO appointmentDTO)
        {
            _logger.LogInformation("Request received: {@AppointmentDTO}", appointmentDTO);

            var service = await _context.Services.FindAsync(appointmentDTO.ServiceID);
            var employee = await _context.Employees.FindAsync(appointmentDTO.EmployeeID);
            var user = await _context.Users.FindAsync(appointmentDTO.UserID);

            if (service == null || employee == null || user == null)
            {
                return NotFound("Service, Employee or User not found.");
            }

            if (!DateTime.TryParseExact(appointmentDTO.Time, "HH:mm", null, System.Globalization.DateTimeStyles.None, out DateTime startTime))
            {
                return BadRequest("Invalid time format.");
            }

            // Parse AppointmentDate from the DTO and specify Kind as UTC
            if (!DateTime.TryParseExact(appointmentDTO.Date, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out DateTime appointmentDate))
            {
                return BadRequest("Invalid date format.");
            }
            appointmentDate = DateTime.SpecifyKind(appointmentDate, DateTimeKind.Utc);

            // Combine appointment date and time, and specify Kind as UTC
            DateTime startDateTime = DateTime.SpecifyKind(appointmentDate.Add(startTime.TimeOfDay), DateTimeKind.Utc);
            DateTime endDateTime = startDateTime.AddMinutes(service.Duration);

            var appointment = new Appointment
            {
                AppointmentDate = startDateTime.Date, // Only the date
                StartTime = startDateTime.ToString("HH:mm"),
                EndTime = endDateTime.ToString("HH:mm"),
                Status = AppointmentStatus.Pending,
                TotalPrice = service.Price,
                UserID = appointmentDTO.UserID,
                EmployeeID = appointmentDTO.EmployeeID,
                ServiceID = appointmentDTO.ServiceID,
                CreatedAt = DateTime.UtcNow // Ensure CreatedAt is also UTC
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(appointment);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.User)
                .Include(a => a.Employee)
                .Include(a => a.Service)
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointmentStatus(int id, [FromBody] AppointmentStatus appointmentStatus)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            // Appointment bulunamadıysa
            if (appointment == null)
            {
                return NotFound(new { message = "Appointment not found." });
            }

            // Appointment status'ünü güncelle
            appointment.Status = appointmentStatus;

            try
            {
                // Değişiklikleri kaydet
                await _context.SaveChangesAsync();

                // Başarılı bir güncelleme sonrası
                return Ok(new { message = "Appointment status updated successfully." });
            }
            catch (Exception ex)
            {
                // Hata durumunda loglama ve mesaj döndürme
                _logger.LogError(ex, "Error updating appointment status.");
                return StatusCode(500, new { message = "An error occurred while updating the appointment status." });
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            _context.Appointments.Remove(appointment);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Appointment deleted successfully." });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting appointment.");
                return StatusCode(500, "An error occurred while deleting the appointment.");
            }
        }



    }
}
