import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../env/environment.prod';
import { Service } from './serviceAssignService';
import { Employee } from './employees.service';

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
  
  getEmployeesByServiceId(serviceId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${serviceId}/employees`);
  }


 
  // Method to get employees by criteria
  getEmployeesByCriteria(
    gender: string,
    service:number,
    date: string
  ): Observable<any[]> {
    const params = {
      gender,
      service,
      date,
    };

    return this.http.get<any[]>(`${this.baseUrl}/employees`, { params });
  }

  // Method to get the price of an employee
  getEmployeePrice(employeeId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/employees/${employeeId}/price`);
  }

  // Method to create an appointment
 
}
