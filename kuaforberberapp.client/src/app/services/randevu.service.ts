import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RandevuService {
  private baseUrl = 'http://localhost:4200';

  constructor(private http: HttpClient) { }

  // Method to get services based on gender
  getHizmetlerByGender(gender: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/services?gender=${gender}`);
  }

  // Method to get employees by criteria
  getEmployeesByCriteria(gender: string, service: string, date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/employees`, {
      params: { gender, service, date },
    });
  }

  // Method to get the price of an employee
  getEmployeePrice(employeeId: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/employees/${employeeId}/price`);
  }

  // Method to create an appointment
  createAppointment(data: { gender: string; service: string; date: string; employee: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointments`, data);
  }
}
