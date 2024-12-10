using kuaforberberApp.Server.Models.DTO;
using KuaforBerberOtomasyon.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Text.Json;

[ApiController]
public class ServiceController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AuthController> _logger;

    public ServiceController(ApplicationDbContext context, ILogger<AuthController> logger)
    {
         
        _logger = logger;
        _context = context;
    }

    // Get Services - returning a list of ServiceDto
    [HttpGet("api/service")]
    public IActionResult GetServices()
    {
        var services = _context.Services
            .Select(service => new ServiceDto
            {
                ServiceID = service.ServiceID,
                Name = service.Name,
                Duration = service.Duration,
                Price = service.Price,
                Gender = service.Gender
            })
            .ToList();

        return Ok(services);
    }

    // Add Service - accepts ServiceDto and converts it to Service entity
    [HttpPost("api/service")]
    public IActionResult AddService([FromBody] ServiceDto serviceDto)
    {
        if (ModelState.IsValid)
        {
            var service = new Service
            {
                Name = serviceDto.Name,
                Duration = serviceDto.Duration,
                Price = serviceDto.Price,
                Gender = serviceDto.Gender,
                CreatedAt = DateTime.UtcNow // UTC olarak ayarlandı

                // Set CreatedAt to current date/time
            };

            _context.Services.Add(service);
            _context.SaveChanges();
            return Ok(service);
        }

        return BadRequest(ModelState);
    }

    // Update Service - accepts ServiceDto and updates the existing Service
    [HttpPut("api/service/{id}")]
    public IActionResult UpdateService(int id, ServiceDto serviceDto)
    {
        var service = _context.Services.Find(id);
        if (service == null) return NotFound();

        service.Name = serviceDto.Name;
        service.Duration = serviceDto.Duration;
        service.Price = serviceDto.Price;
        service.Gender = serviceDto.Gender;

        _context.SaveChanges();
        return Ok(service);
    }

    // Delete Service
    [HttpDelete("api/service/{id}")]
    public IActionResult DeleteService(int id)
    {
        var service = _context.Services.Find(id);
        if (service == null) return NotFound();

        _context.Services.Remove(service);
        _context.SaveChanges();
        return Ok();
    }

    // Assign Service to Employee (this remains unchanged)
    [HttpPost("api/service/assign-service")]
    public IActionResult AssignServiceToEmployee([FromBody] AssignServiceDto assignServiceDto)
    {
        var employee = _context.Employees.Find(assignServiceDto.EmployeeId);
        var service = _context.Services.Find(assignServiceDto.ServiceId);

        if (employee == null || service == null)
            return NotFound();

        // Aynı EmployeeID ve ServiceID kombinasyonunu kontrol et
        var existingEmployeeService = _context.EmployeeServices
            .FirstOrDefault(es => es.EmployeeID == assignServiceDto.EmployeeId
                               && es.ServiceID == assignServiceDto.ServiceId);

        if (existingEmployeeService != null)
        {
            // Eğer zaten eşleşme varsa, bir hata dönebilirsiniz
            return BadRequest("Bu çalışan ve hizmet zaten eşleştirilmiş.");
        }

        var employeeService = new EmployeeService
        {
            EmployeeID = assignServiceDto.EmployeeId,
            ServiceID = assignServiceDto.ServiceId
        };

        _context.EmployeeServices.Add(employeeService);
        _context.SaveChanges();

        // JsonSerializer ile döngüyü önlemek için ReferenceHandler.Preserve kullanın
        var options = new JsonSerializerOptions
        {
            ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve
        };

        return Ok(JsonSerializer.Serialize(employeeService, options));
    }


    // Get All Employees with their assigned Services
    [HttpGet("api/employee-services")]
    public IActionResult GetEmployeeServices()
    {
        var employeeServices = _context.EmployeeServices
            .Include(es => es.Employee)    // Çalışanı dahil et
            .Include(es => es.Service)     // Hizmeti dahil et
            .Select(es => new ServiceEmployeeDto   // ServiceEmployeeDto'yu kullanıyoruz
            {
                EmployeeName = es.Employee.Name,    // Çalışan adı
                ServiceName = es.Service.Name,      // Hizmet adı
                Duration = es.Service.Duration,    // Hizmet süresi
                Price = es.Service.Price,           // Hizmet ücreti
                Gender = es.Service.Gender         // Hizmet cinsiyeti
            })
            .ToList();

        // Eğer boş veri gelirse, daha açıklayıcı bir cevap dönebilirsiniz
        if (!employeeServices.Any())
        {
            return NotFound("No employee services found.");
        }

        return Ok(employeeServices);
    }



    [HttpGet("api/service/{gender}")]
    public IActionResult GetServicesByGender(string gender)
    {

        _logger.LogInformation("Normal user detected: {Email}", gender);
        var services = _context.Services
       .Where(service => service.Gender.ToLower() == gender.ToLower())
       .Select(service => new ServiceDto
       {
           ServiceID = service.ServiceID,
           Name = service.Name,
           Duration = service.Duration,
           Price = service.Price,
           Gender = service.Gender
       })
       .ToList();


        _logger.LogInformation("Query returned {Count} services for gender: {Gender}", services.Count, gender);
     
        return Ok(services);
    }


    // Backend: API endpoint
    [HttpGet("api/service/{serviceId}/employees")]
    public IActionResult GetEmployeesByServiceId(int serviceId)
    {
        // Servise göre ilişkili çalışanları alıyoruz
        var employees = _context.EmployeeServices
            .Where(es => es.ServiceID == serviceId) // Belirtilen ServiceID'ye sahip çalışanlar
            .Select(es => new
            {
                es.Employee.EmployeeID,
                es.Employee.Name,
                es.Employee.StartTime,
                es.Employee.EndTime
            })
            .ToList();

        if (employees == null || employees.Count == 0)
        {
            _logger.LogWarning("No employees found for serviceId: {ServiceId}", serviceId);
            return NotFound("No employees found for the selected service.");
        }

        _logger.LogInformation("Employees found for serviceId: {ServiceId}", serviceId);
        return Ok(employees); // Çalışanları döndürüyoruz
    }





}
