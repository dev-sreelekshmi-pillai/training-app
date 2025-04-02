import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { employee } from '../model/model';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [DatePipe, CommonModule, EmployeeFormComponent, TitleCasePipe],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {
  authServ = inject(AuthService);
  employeeList = signal<employee[]>([]);
  selectedEmp = signal<employee | null>(null);
  isModalOpen = signal(false);

  ngOnInit(): void {
    this.getEmployessList()
  }

  openModal(emp?: employee) {
    this.selectedEmp.set(emp ?? null)
    this.isModalOpen.set(true)
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  getEmployessList() {
    this.authServ.getAllEmployees().subscribe({
      next: (res) => {
        this.employeeList.set(res.data.result)
        if (res.errorMessages) { alert(res.errorMessages) }
      },
      error: (err) => {
        alert('Error fetching company details: ' + err.message);
      }
    })
  }

  saveEmployee(event: any) {
    alert(event)
    this.getEmployessList();
  }

  // deleteEmp(emp: employee) {
  // }
}
