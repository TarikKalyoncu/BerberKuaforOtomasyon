import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { RandevuService } from '../../services/randevu.service';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-randevual',
  templateUrl: './randevuAl.html',
  standalone: false,
  styleUrls: ['./randevuAl.css'],
})
export class RandevuAlComponent {
  public genderSubject = new BehaviorSubject<string>('');
  public serviceSubject = new BehaviorSubject<string | null>(null);
  public dateSubject = new BehaviorSubject<string | null>(null); // Updated to store date as string
  public employeeSubject = new BehaviorSubject<string | null>(null);

  gender$ = this.genderSubject.asObservable();
  services$: Observable<any[]> = this.gender$.pipe(
    switchMap((gender) => {
      if (!gender) {
        return of([]);
      }
      return this.randevuService.getHizmetlerByGender(gender).pipe(
        tap(() => this.toastr.success('Services loaded!')),
        catchError(() => {
          this.toastr.error('Error loading services.');
          return of([]);
        })
      );
    })
  );

  employees$: Observable<any[]> = this.dateSubject.pipe(
    switchMap((date) => {
      const gender = this.genderSubject.getValue();
      const service = this.serviceSubject.getValue();
      if (!date || !gender || !service) {
        return of([]);
      }
      return this.randevuService.getEmployeesByCriteria(gender, service, date).pipe(
        tap(() => this.toastr.success('Employees loaded!')),
        catchError(() => {
          this.toastr.error('Error loading employees.');
          return of([]);
        })
      );
    })
  );

  selectedEmployeePrice$: Observable<number> = this.employeeSubject.pipe(
    switchMap((employeeId) => {
      if (!employeeId) {
        return of(0);
      }
      return this.randevuService.getEmployeePrice(employeeId).pipe(
        catchError(() => {
          this.toastr.error('Error fetching price.');
          return of(0);
        })
      );
    })
  );

  constructor(
    private randevuService: RandevuService,
    private toastr: ToastrService
  ) { }

  selectGender(gender: string) {
    this.genderSubject.next(gender);
    this.serviceSubject.next(null);
    this.dateSubject.next(null);
    this.employeeSubject.next(null);
    this.toastr.success('Gender selected!');
  }

  selectService(service: string) {
    this.serviceSubject.next(service);
    this.dateSubject.next(null);
    this.employeeSubject.next(null);
    this.toastr.success('Service selected!');
  }

  selectDate(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.value) {
      this.dateSubject.next(input.value);
      this.employeeSubject.next(null);
      this.toastr.success('Date selected!');
    } else {
      this.toastr.error('Invalid date selected.');
    }
  }


  selectEmployee(employeeId: string) {
    this.employeeSubject.next(employeeId);
    this.toastr.success('Employee selected!');
  }

  createAppointment() {
    const gender = this.genderSubject.getValue();
    const service = this.serviceSubject.getValue();
    const date = this.dateSubject.getValue();
    const employee = this.employeeSubject.getValue();

    if (!gender || !service || !date || !employee) {
      this.toastr.error('Complete all selections.');
      return;
    }

    this.randevuService.createAppointment({ gender, service, date, employee }).subscribe(
      () => {
        this.toastr.success('Appointment created successfully!');
      },
      () => {
        this.toastr.error('Error creating appointment.');
      }
    );
  }
}
