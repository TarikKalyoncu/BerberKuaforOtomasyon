import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../env/environment.prod';
import { ToastrService } from 'ngx-toastr';
 

export interface Employee {
  employeeID?: number;
  name: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
}

export interface ServiceEmployee {
  employeeName: string;
  serviceName: string;
  duration: number;
  price: number;
  gender: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  constructor(private http: HttpClient, private toastr: ToastrService) { }



  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${environment.baseApiUrl}/api/employees`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toastr.error('Failed to fetch employees.', 'Error');
        return throwError(() => new Error(error.message));
      })
    );
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${environment.baseApiUrl}/api/employees`, employee).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toastr.error('Failed to add the employee.', 'Error');
        return throwError(() => new Error(error.message));
      })
    );
  }

  updateEmployee(id: number, employee: Employee): Observable<void> {
    return this.http.put<void>(`${environment.baseApiUrl}/api/employees/${id}`, employee).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toastr.error('Failed to update the employee.', 'Error');
        return throwError(() => new Error(error.message));
      })
    );
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseApiUrl}/api/employees/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toastr.error('Failed to delete the employee.', 'Error');
        return throwError(() => new Error(error.message));
      })
    );
  }


  getEmployeeServices(): Observable<any> {
    return this.http.get<any>(`${environment.baseApiUrl}/api/employee-services`);
  }
}
