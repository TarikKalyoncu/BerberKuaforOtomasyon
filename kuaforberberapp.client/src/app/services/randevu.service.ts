import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../env/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class RandevuService {
  private baseUrl = `${environment.baseApiUrl}/api/service`;

  constructor(private http: HttpClient) { }

  // Method to get services based on gender
  getHizmetlerByGender(gender: string): Observable<any> {
    const url = `${this.baseUrl}/${gender}`; // gender'ı URL yoluna ekliyoruz
    return this.http.get(url);
  }

  // Assuming this.baseUrl is: 'http://localhost:5198'
  getEmployeesByServiceId(serviceId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${serviceId}/employees`);
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
