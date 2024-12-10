import { Component, OnInit, ViewChild } from '@angular/core';
import { AllAppointment, Appointment, AppointmentService, AppointmentStatus } from '../../services/appointment.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-appointment-management',
  templateUrl: './appointmentManagement.html',
  standalone: false,
  styleUrls: ['./appointmentManagement.css'],
})
export class AppointmentManagementComponent implements OnInit {
  appointments: AllAppointment[] = [];
 

  displayedColumns: string[] = [
    'appointmentID',
    'appointmentDate',
    'startTime',
    'endTime',
    'status',
    'totalPrice',
    'user',
    'employee',
    'service',
    'action',
  ];

  statuses = [
    { value: 0, label: 'Pending' },
    { value: 1, label: 'Confirmed' },
    { value: 2, label: 'Cancelled' },
  ];

  
  dataSource = new MatTableDataSource<AllAppointment>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private appointmentService: AppointmentService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe(
      (data) => {
        this.appointments = data;
        console.log(this.appointments);
        this.dataSource.data = this.appointments;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      () => {
        this.toastr.error('Failed to load appointments.', 'Error');
      }
    );
  }

  getStatusLabel(value: number): string {
    return this.statuses.find((status) => status.value === value)?.label || '';
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateStatus(appointment: AllAppointment, status: AppointmentStatus): void {
    console.log(status,"status")
    const updatedAppointment = { ...appointment, status };

    this.appointmentService.updateAppointment(updatedAppointment).subscribe(
      () => {
        this.toastr.success('Appointment status updated successfully.', 'Success');
        this.loadAppointments();
      },
      () => {
        this.toastr.error('Failed to update appointment status.', 'Error');
      }
    );
  }

  deleteAppointment(id: number): void {
    this.appointmentService.deleteAppointment(id).subscribe(
      () => {
        this.toastr.success('Appointment deleted successfully.', 'Success');
        this.loadAppointments();
      },
      () => {
        this.toastr.error('Failed to delete appointment.', 'Error');
      }
    );
  }
}
