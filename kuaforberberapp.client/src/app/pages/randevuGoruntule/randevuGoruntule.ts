import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { AllAppointment, AppointmentService } from '../../services/appointment.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-randevugoruntule',
  templateUrl: './randevuGoruntule.html',
  standalone: false,
  styleUrls: ['./randevuGoruntule.css'],
})
export class RandevuGoruntuleComponent implements OnInit {
  user$: Observable<User | null>;
  appointments: AllAppointment[] = [];

  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService,
    private toastr: ToastrService
  ) {
    // Initialize the user$ observable in the constructor
    this.user$ = this.userService.getCurrentUserObservable();
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.loadUserAppointments(user.id); // Kullanıcının randevularını yükle
      }
    });
  }

  private loadUserAppointments(userId: number): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (appointments) => {
        this.appointments = appointments.filter(app => app.userID === userId); // Kullanıcının randevularını filtrele
      },
      error: (error) => {
        this.toastr.error('Randevular yüklenirken bir hata oluştu.', 'Hata');
      }
    });
  }
}
