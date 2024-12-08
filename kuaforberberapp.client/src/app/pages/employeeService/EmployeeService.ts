import { Component, OnInit } from '@angular/core';
import { EmployeeService, ServiceEmployee } from '../../services/employees.service';
@Component({
  selector: 'app-employeeservice',
  templateUrl: './employeeService.html',
  standalone: false,
  styleUrls: ['./employeeService.css']
})
export class EmployeeServiceComponent implements OnInit {
  employeeServices: ServiceEmployee[] = []; // doğru tip ile tanımlama
  displayedColumns: string[] = ['EmployeeName', 'ServiceName', 'Duration', 'Price', 'Gender']; // Görüntülenecek sütunlar

  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.loadEmployeeServices();
  }

  loadEmployeeServices(): void {
    this.employeeService.getEmployeeServices().subscribe((data) => {
      this.employeeServices = data;
    });
  }
}
