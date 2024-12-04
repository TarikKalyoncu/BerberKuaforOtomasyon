using KuaforBerberOtomasyon.Enums;
using System.ComponentModel.DataAnnotations;

public class User
{
    [Key]
    public int UserID { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public UserRole Role { get; set; } // Admin, Employee, Customer gibi rolleri burada tutabilirsiniz.
}
