import { Component, OnInit } from '@angular/core';

import { EmployeeService } from '../../services/employees.service';
import { Service, ServiceAssignService, ServiceType, ServiceGender } from '../../services/serviceAssignService';
import { ToastrService } from 'ngx-toastr';

import { MatDialog } from '@angular/material/dialog';
import { ServiceAssignmentComponent } from '../ServiceAssignment/ServiceAssignment';

@Component({
  selector: 'app-servicemanagement',
  templateUrl: './serviceManagement.html',
  standalone: false,
  styleUrls: ['./serviceManagement.css'],
})
export class ServiceManagementComponent implements OnInit {
  services: Service[] = [];
  newService: Service = {
    name: ServiceType.SacKesimi,
    duration: 0,
    price: 0,
    gender: ServiceGender.Erkek,
  };
  employees: any[] = [];
  selectedEmployee: number | null = null;
  selectedService: Service | null = null; // Change type to Service

  serviceTypes = Object.values(ServiceType); // Tüm hizmet türlerini listelemek için
  genders = Object.values(ServiceGender);    // Cinsiyet enum'larını listelemek için

  editMode: boolean = false; // Add editMode property

  constructor(
    private serviceService: ServiceAssignService,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadServices();
    this.loadEmployees();
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe((data) => (this.services = data));
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe((data) => (this.employees = data));
  }

  openAssignServiceDialog(): void {
    console.log(this.employees)
    console.log(this.services)
    const dialogRef = this.dialog.open(ServiceAssignmentComponent, {
      width: '80%',
      data: { employees: this.employees, services: this.services },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.toastr.success('Service assigned successfully!', 'Success');
      }
    });
  }

  addService(): void {
    this.serviceService.addService(this.newService).subscribe({
      next: () => {
        this.loadServices();
        this.resetNewService();
        this.toastr.success('Service added successfully.', 'Success');
      },
      error: (error) => {
        this.toastr.error('Failed to add service.', 'Error');
      }
    });
  }


  openFullContentDialog(row: any) {
    this.dialog.open(ServiceAssignmentComponent, {
      width: '80%',
    });
  }


  resetNewService(): void {
    this.newService = {
      name: ServiceType.SacKesimi,
      duration: 0,
      price: 0,
      gender: ServiceGender.Erkek,
    };
  }



  editService(service: Service): void {
    this.editMode = true;
    this.selectedService = { ...service };  // Seçilen servisi kopyalayarak düzenlemeye başlıyoruz.
  }

  deleteService(serviceId: number): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.serviceService.deleteService(serviceId).subscribe({
        next: () => {
          this.loadServices();
          this.toastr.success('Service deleted successfully.', 'Success');
        },
        error: (error) => {
          this.toastr.error('Failed to delete service.', 'Error');
        }
      });
    }
  }

  updateService(): void {
    if (this.selectedService) {
      this.serviceService.updateService(this.selectedService.serviceID!, this.selectedService).subscribe({
        next: (updatedService) => {
          this.loadServices();
          this.resetNewService();
          this.editMode = false;
          this.toastr.success('Service updated successfully.', 'Success');
        },
        error: (error) => {
          this.toastr.error('Failed to update service.', 'Error');
        }
      });
    }
  }

}
