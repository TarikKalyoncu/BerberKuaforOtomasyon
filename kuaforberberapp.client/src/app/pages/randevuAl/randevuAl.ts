import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { RandevuService } from '../../services/randevu.service';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from 'rxjs';
import { Service } from '../../services/serviceAssignService';
import { Employee } from '../../services/employees.service';
import { Appointment, AppointmentService } from '../../services/appointment.service';
import { combineLatest } from 'rxjs/operators';

@Component({
  selector: 'app-randevual',
  templateUrl: './randevuAl.html',
  standalone: false,
  styleUrls: ['./randevuAl.css'],
})
export class RandevuAlComponent {
  public genderSubject = new BehaviorSubject<string>('');
  public serviceSubject = new BehaviorSubject<Service | null>(null);
  public dateSubject = new BehaviorSubject<string | null>(null); // Updated to store date as string
  public employeeSubject = new BehaviorSubject<Employee | null>(null);
  public timeSubject = new BehaviorSubject<string | null>(null);
  public selectedTime$ = this.timeSubject.asObservable();  // Expose as Observable for other components to subscribe
  gender$ = this.genderSubject.asObservable();
  employees$: Observable<any[]>;
  availableTimeSlots: string[] = [];
  selectedGender: string | null = null;
  selectedService: string | null = null;
  selectedEmployee: string | null = null;





  services$: Observable<Service[]> = this.gender$.pipe(
    switchMap((gender) => {
      if (!gender) {
        return of([]);
      }
      console.log(gender, 2);
      return this.randevuService.getHizmetlerByGender(gender).pipe(
        tap(() => this.toastr.success('Services loaded!')),
        catchError(() => {
          this.toastr.error('Error loading services.');
          return of([]);
        })
      );
    })
  );
 


  selectedEmployeePrice$: Observable<number> = this.serviceSubject.pipe(
    switchMap((service) => {
      if (!service) {
        return of(0);  // If no service is selected, return a default value of 0
      }

      // Assuming service.price is a number, if it's an observable, you'd use .pipe() here
      return of(service.price).pipe(   // Wrap service.price in an observable
        catchError(() => {
          this.toastr.error('Error fetching price.');
          return of(0);  // Return 0 if there's an error
        })
      );
    })
  );


  constructor(
    private randevuService: RandevuService,
    private appointmentService: AppointmentService,
    private toastr: ToastrService
  ) { }

  selectGender(gender: string) {
    this.genderSubject.next(gender);
    this.selectedGender = gender;
    console.log(gender,1);
    this.serviceSubject.next(null);
    this.dateSubject.next(null);
    this.employeeSubject.next(null);
    this.toastr.success('Gender selected!');
  }

  selectService(service: Service) {
    this.serviceSubject.next(service);
    this.selectedService = service.name;
    this.dateSubject.next(null);
    this.employeeSubject.next(null);

    console.log(service, 11111);

    this.employees$ = this.randevuService.getEmployeesByServiceId(service.serviceID!).pipe(
      tap((employees) => {
        console.log('Employees:', employees); // Log the employees here
        this.toastr.success('Employees loaded!');
      }),
      catchError(() => {
        this.toastr.error('Error loading employees.');
        return of([]); // Return an empty array in case of error
      })
    );


    this.toastr.success('Service selected!');
  }

 

  selectEmployee(employee: Employee) {
    // Çalışan seçimini kaydet
    console.log(employee);

    this.employeeSubject.next(employee);
    this.selectedEmployee = employee.name;

    // Çalışanın çalışma saatlerini al

    // Zaman aralıklarını oluştur ve güncelle
    this.availableTimeSlots = this.generateTimeSlots(employee.startTime, employee.endTime);

    this.toastr.success(`Employee ${employee.name} selected and timeslots updated!`);
  }



  selectDate(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.value) {
      this.dateSubject.next(input.value); // Tarih değerini yayınla

      // Diğer Subject'ların son değerlerini al
      const date = input.value;
      const gender = this.genderSubject.getValue(); // BehaviorSubject olduğu varsayılıyor
      const service = this.serviceSubject.getValue(); // BehaviorSubject olduğu varsayılıyor
      const employee = this.employeeSubject.getValue(); // BehaviorSubject olduğu varsayılıyor

      // Tüm değerlerin tanımlı olup olmadığını kontrol et
      if (!date || !gender || !service || !employee) {
        this.toastr.error('Some required values are missing!');
        return;
      }

      // Randevuları al ve müsait zaman aralıklarını hesapla
      this.appointmentService.getAppointmentsForEmployeeOnDate(employee.employeeID!, date).pipe(
        switchMap((appointments: Appointment[]) => {
         

          const allTimeSlots = this.generateTimeSlots(employee.startTime, employee.endTime);
           
          if (!appointments || appointments.length === 0) {
            // Eğer appointments boşsa, tüm slotlar müsait
            return of(allTimeSlots);
          } else {
            // Eğer appointments varsa, unavailable ve available slotları hesapla
            const unavailableSlots = this.getUnavailableTimeSlots(appointments);
            const extendedUnavailableSlots = this.getExtendedUnavailableSlots(unavailableSlots);
            const availableSlots = allTimeSlots.filter((time) => !extendedUnavailableSlots.includes(time));
            return of(availableSlots);
          }
        }),
        catchError((error) => {
          console.error('Error fetching appointments:', error);
          this.toastr.error('Error fetching available time slots.');
          return of([]); // Hata durumunda boş liste dön
        })
      ).subscribe((availableSlots) => {
        console.log('Available Time Slots:', availableSlots);
        this.toastr.success('Available time slots updated!');
        this.availableTimeSlots = availableSlots; // Eğer bir değişkene atamak istiyorsanız
      });
    } else {
      this.toastr.error('Invalid date selected.');
    }
  }




  createAppointment() {
    const gender = this.genderSubject.getValue();
    const service = this.serviceSubject.getValue();
    const date = this.dateSubject.getValue();
    const employee = this.employeeSubject.getValue();
    const time = this.timeSubject.getValue(); // time değeri "HH:mm" formatında string olarak kabul ediliyor

    console.log(gender, 1);
    console.log(service, 2);
    console.log(date, 3);
    console.log(employee, 4);
    console.log(time, 5);

    // Seçimlerin tam olup olmadığını kontrol et
    if (!gender || !service || !date || !employee || !time) {
      this.toastr.error('Complete all selections, including time.');
      return;
    }

    // Time kontrolü (çalışma saatini aşmama)
    const startTimeInMinutes = this.convertToMinutes(time); // Başlangıç saati dakika olarak
    const endTimeInMinutes = startTimeInMinutes + service.duration; // Hizmet süresi eklendi
    const employeeEndTimeInMinutes = this.convertToMinutes(employee.endTime); // Çalışanın bitiş saati dakika olarak

    if (endTimeInMinutes > employeeEndTimeInMinutes) {
      this.toastr.error('The selected time exceeds the employee\'s working hours.');
      return;
    }

    // Randevuyu oluştur
    this.appointmentService.createAppointment({ gender, service, date, employee, time }).subscribe(
      () => this.toastr.success('Appointment created successfully!'),
      () => this.toastr.error('Error creating appointment.')
    );
  }


  generateTimeSlots(startTime: string, endTime: string): string[] {
    const timeSlots: string[] = [];
    const start = this.convertToMinutes(startTime);
    const end = this.convertToMinutes(endTime);

    for (let time = start; time < end; time += 30) {
      timeSlots.push(this.formatTime(time));
    }

    return timeSlots;
  }

  convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${this.padZero(hours)}:${this.padZero(mins)}`;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  getUnavailableTimeSlots(appointments: Appointment[]): string[] {
    const unavailableSlots: string[] = [];
    appointments.forEach((appointment) => {
      const appointmentStartTimeInMinutes = this.convertToMinutes(appointment.startTime); // Convert to minutes
      const appointmentEndTimeInMinutes = this.convertToMinutes(appointment.endTime); // Convert to minutes
      unavailableSlots.push(this.formatTime(appointmentStartTimeInMinutes)); // Format back to string
      unavailableSlots.push(this.formatTime(appointmentEndTimeInMinutes)); // Format back to string
    });
    console.log("unavailableSlots", unavailableSlots)
    return unavailableSlots;
  }


  selectTime(event: Event) {
    const input = event.target as HTMLSelectElement;
    if (input?.value) {
      // Update timeSubject with the selected time
      this.timeSubject.next(input.value);

      console.log('Selected time:', input.value);
      this.toastr.success(`Time slot selected: ${input.value}`);
    } else {
      this.toastr.error('Invalid time slot selected.');
    }
  }

  getExtendedUnavailableSlots(unavailableSlots: string[]): string[] {
    const extendedSlots: string[] = [];

    for (let i = 0; i < unavailableSlots.length; i += 2) {
      const startTime = unavailableSlots[i];
      const endTime = unavailableSlots[i + 1];

      if (startTime && endTime) {
        let currentSlotInMinutes = this.convertToMinutes(startTime);
        const endSlotInMinutes = this.convertToMinutes(endTime);

        while (currentSlotInMinutes < endSlotInMinutes) {
          extendedSlots.push(this.formatTime(currentSlotInMinutes));
          currentSlotInMinutes += 30; // Her slotu 30 dakika aralıklarla hesapla
        }
      }
    }

    return extendedSlots;
  }


}
