// serviceAssignment.component.ts
import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Service, ServiceAssignService } from '../../services/serviceAssignService';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Employee } from '../../services/employees.service';

@Component({
  selector: 'app-service-assignment',
  templateUrl: './serviceAssignment.html',
  standalone: false,
  styleUrls: ['./serviceAssignment.css']
})
export class ServiceAssignmentComponent {
  [x: string]: any;
  selectedEmployee: Employee | null = null;
  selectedService: Service | null = null;

  constructor(
    public dialogRef: MatDialogRef<ServiceAssignmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employees: Employee[], services: Service[]},
    private serviceAssignService: ServiceAssignService,
    private toastr: ToastrService,
  ) { }

  

  assignService(): void {
    if (this.selectedEmployee && this.selectedService) {
      // Call API to assign the service to the employee
      this.serviceAssignService
        .assignServiceToEmployee(this.selectedEmployee.employeeID!, this.selectedService.serviceID!)
        .subscribe({
          next: () => {
            this.toastr.success('Service successfully assigned to the employee.', 'Success');
 
            this.dialogRef.close(true); // Close the dialog with success status
          },
          error: () => {
            this.toastr.error('Failed to assign the service to the employee.', 'Error');
          },
        });
    } else {
      alert('Please select both an employee and a service.');
    }
  }
}
