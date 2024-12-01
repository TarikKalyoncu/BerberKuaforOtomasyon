using KuaforBerberOtomasyon.Models;

public class EmployeeService
{
    public int EmployeeServiceID { get; set; } // Birincil anahtar
    public int EmployeeID { get; set; } // Yabancı anahtar
    public int ServiceID { get; set; } // Yabancı anahtar

    // Diğer özellikler
    public virtual Employee Employee { get; set; }
    public virtual Service Service { get; set; }
}
