import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../env/environment.prod';


export enum ServiceType {
  SacKesimi = 'SacKesimi',
  SacBoyama = 'SacBoyama',
  SacSekillendirme = 'SacSekillendirme',
  SacBakimi = 'SacBakimi',
  Tirasse = 'Tirasse',
  CiltBakimi = 'CiltBakimi',
  Manikur = 'Manikur',
  Pedikur = 'Pedikur',
  Masaj = 'Masaj',
  Agda = 'Agda',
  KasSekillendirme = 'KasSekillendirme',
  SakalBakimi = 'SakalBakimi',
  TirnakSanati = 'TirnakSanati',
  Makyaj = 'Makyaj',
  KirpikUzatma = 'KirpikUzatma',
  KaliciMakyaj = 'KaliciMakyaj',
  GelinMakyaji = 'GelinMakyaji',
  SacUzatma = 'SacUzatma',
  KInaTasarlama = 'KInaTasarlama',
  VucutBakimi = 'VucutBakimi',
  SakalDuzeltme = 'SakalDuzeltme',
  SacDovmesi = 'SacDovmesi',
  KulakBurunAgdasi = 'KulakBurunAgdasi',
  SicakHavluServisi = 'SicakHavluServisi',
}


export enum ServiceGender {
  Erkek = 'Erkek',
  Kadın = 'Kadın',
}

export interface Service {
  serviceID?: number;
  name: ServiceType;
  duration: number;
  price: number;
  gender: ServiceGender;
}



@Injectable({
  providedIn: 'root',
})
export class ServiceAssignService {
  private baseUrl = `${environment.baseApiUrl}/api/service`;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.baseUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toastr.error('Failed to fetch services.', 'Error');
        return throwError(() => new Error(error.message));
      })
    );
  }

  addService(service: Service): Observable<Service> {
    console.log(service);
    return this.http.post<Service>(this.baseUrl, service).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toastr.error('Failed to add the service.', 'Error');
        return throwError(() => new Error(error.message));
      })
    );
  }

  updateService(id: number, service: Service): Observable<Service> {
    return this.http.put<Service>(`${this.baseUrl}/${id}`, service).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toastr.error('Failed to update the service.', 'Error');
        return throwError(() => new Error(error.message));
      })
    );
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toastr.error('Failed to delete the service.', 'Error');
        return throwError(() => new Error(error.message));
      })
    );
  }

  assignServiceToEmployee(employeeId: number, serviceId: number): Observable<void> {
    console.log(employeeId);
    console.log(serviceId);
    return this.http.post<void>(`${this.baseUrl}/assign-service`, { employeeId, serviceId }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toastr.error('Failed to assign the service to the employee.', 'Error');
        return throwError(() => new Error(error.message));
      })
    );
  }


}
