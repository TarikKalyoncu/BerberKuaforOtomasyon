import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeService } from '../../services/employees.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employeemanagement',
  templateUrl: './employeeManagement.html',
  standalone: false,
  styleUrls: ['./employeeManagement.css'],
})
export class EmployeeManagementComponent implements OnInit {
  employees: Employee[] = [];
  newEmployee: Employee = { name: '', startTime: '', endTime: '' };
  editMode: boolean = false;
  selectedEmployee: Employee | null = null;

  // Tam saatler
  hours: string[] = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  constructor(private employeeService: EmployeeService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees = data;
    });
  }


  editEmployee(employee: Employee): void {
    this.editMode = true;
    this.selectedEmployee = { ...employee };
  }

  addEmployee(): void {
    // Form verilerinin doğruluğunu kontrol et
    if (!this.newEmployee.name.trim() || !this.newEmployee.startTime.trim() || !this.newEmployee.endTime.trim()) {
      this.toastr.error('All fields are required.', 'Error');
      return;
    }

    this.employeeService.addEmployee(this.newEmployee).subscribe(
      () => {
        this.loadEmployees();
        this.toastr.success('Employee added successfully.', 'Success');
        this.newEmployee = { name: '', startTime: '', endTime: '' };
      },
      () => {
        this.toastr.error('Failed to add employee.', 'Error');
      }
    );
  }

  updateEmployee(): void {
    if (!this.selectedEmployee) {
      this.toastr.error('No employee selected for update.', 'Error');
      return;
    }

    // Form verilerinin doğruluğunu kontrol et
    if (
      !this.selectedEmployee.name.trim() ||
      !this.selectedEmployee.startTime.trim() ||
      !this.selectedEmployee.endTime.trim()
    ) {
      this.toastr.error('All fields are required.', 'Error');
      return;
    }

    this.employeeService.updateEmployee(this.selectedEmployee.employeeID!, this.selectedEmployee).subscribe(
      () => {
        this.loadEmployees();
        this.toastr.success('Employee updated successfully.', 'Success');
        this.editMode = false;
        this.selectedEmployee = null;
      },
      () => {
        this.toastr.error('Failed to update employee.', 'Error');
      }
    );
  }


  deleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe(
      () => {
        this.toastr.success('Employee deleted successfully.', 'Success');
        this.loadEmployees(); // Refresh list
      },
      () => {
        this.toastr.error('Failed to delete employee.', 'Error');
      }
    );
  }
}
