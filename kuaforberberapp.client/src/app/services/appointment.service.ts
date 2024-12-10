import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, switchMap, take, throwError } from 'rxjs';
import { environment } from '../env/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { Employee } from './employees.service';
import { Service } from './serviceAssignService';
import { UserService } from './user.service';
import { User } from '../models/user.model';


export interface Appointment {
  AppointmentID: number;
  AppointmentDate: string;  // DateTime türü, ISO string formatında gönderilebilir.
  startTime: string;       // StartTime, HH:mm formatında string olacak.
  endTime: string;         // EndTime, HH:mm formatında string olacak.
  Status: AppointmentStatus;  // Enum türündeki status. (Örnek: Pending, Completed, Cancelled)
  TotalPrice: number;
  CreatedAt: string;         // DateTime türü, ISO string formatında gönderilebilir.
  UserID: number;            // Kullanıcı ID'si
  EmployeeID: number;        // Çalışan ID'si    // Çalışan Adı
  ServiceID: number;         // Hizmet ID'si    // Hizmet adı
}

export interface AllAppointment {
  appointmentID: number;
  appointmentDate: string; // ISO formatta tarih
  startTime: string; // Saat formatında
  endTime: string; // Saat formatında
  status: AppointmentStatus; // Durum bilgisi için
  totalPrice: number;
  createdAt: string; // ISO formatta tarih
  userID: number;
  user: User;
  employeeID: number;
  employee: Employee;
  serviceID: number;
  service: Service;
}

export enum AppointmentStatus {
  Pending = 'Pending',
  Completed = 'Confirmed',
  Cancelled = 'Cancelled'
}



@Injectable({
  providedIn: 'root',
})
export class AppointmentService {

  constructor(private http: HttpClient, private toastr: ToastrService, private userService: UserService) { }

  private baseUrl = `${environment.baseApiUrl}/api/appointment`;

  getAppointmentsForEmployeeOnDate(employeeId: number, date: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/appointments/employee/${employeeId}/date/${date}`).pipe(
      catchError((error) => {
        if (error.status === 404) {
          console.warn('No appointments found for the given employee and date.');
          return of([]); // Eğer 404 hatası alırsanız, boş bir liste döndür
        }
        console.error('Error fetching appointments:', error);
        return throwError(() => error); // Diğer hataları üst seviyeye fırlat
      })
    );
  }


  createAppointment(data: { gender: string; service: Service; date: string; employee: Employee; time: string }): Observable<any> {
    // Get the current logged-in user
    return this.userService.getCurrentUserObservable().pipe(
      take(1), // Make sure to take only the current value of the observable
      switchMap(user => {
        if (!user) {
          this.toastr.error('User not logged in.', 'Error');
          return throwError('User not logged in.');
        }
        
        // Include the user ID in the appointment data
        const appointmentData = {
          Gender: data.gender,
          ServiceID: data.service.serviceID,
          EmployeeID: data.employee.employeeID,
          Time: data.time,
          Date: data.date,
          UserID: user.id
        };

        console.log(appointmentData,99)
        return this.http.post(`${this.baseUrl}/appointments`, appointmentData, { headers: { 'Content-Type': 'application/json' } });
      })
    );

  }

  getAllAppointments(): Observable<AllAppointment[]> {
    return this.http.get<AllAppointment[]>(`${this.baseUrl}/all`).pipe(
      catchError((error) => {
        this.toastr.error('Error fetching appointments.', 'Error');
        return throwError(() => error);
      })
    );
  }

  updateAppointment(appointment: AllAppointment): Observable<any> {
    console.log(appointment,"appointment")
    return this.http.put(`${this.baseUrl}/${appointment.appointmentID}`, appointment.status).pipe(
      catchError((error) => {
        this.toastr.error('Error updating appointment.', 'Error');
        return throwError(() => error);
      })
    );
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        this.toastr.error('Error deleting appointment.', 'Error');
        return throwError(() => error);
      })
    );
  }
}
