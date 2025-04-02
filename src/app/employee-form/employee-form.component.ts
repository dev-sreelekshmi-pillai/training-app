import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { employee } from '../model/model';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
  @Input() employee: employee | null = null;
  fb = inject(FormBuilder)
  authServ = inject(AuthService)
  empForm!: FormGroup
  empNewForm!: FormGroup
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<string>();

  constructor() {
    this.empNewForm = (this.fb.group({
      fullName: ['', Validators.required],
      birthDate: '',
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      officeContactNo: '',
      parmenantAddress: '',
      currentAddress: '',
      isCurrentSameAsParmenantAddress: false,
      personalEmailId: ['', Validators.email],
      personalMobileNo: ['',],
      otherContactNo: ['',],
      employeeCode: '',
      joiningOn: '',
    }))
  }

  ngOnInit(): void {
    this.empForm = (this.fb.group({
      fullName: [this.employee?.fullName, Validators.required],
      joiningOn: this.formatDate(this.employee?.joiningOn ?? ''),
      lastName: [this.employee?.lastName, Validators.required],
      firstName: [this.employee?.firstName, Validators.required],
      middleName: [this.employee?.middleName, Validators.required],
      officeContactNo: this.employee?.officeContactNo,
      designationName: this.employee?.designationName,
      departmentName: this.employee?.departmentName,
      resignationOn: this.employee?.resignationOn,
    }))
    this.empForm.enable()
  }

  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
  updateEmployee() {
    let emp = {
      ...this.employee, ...this.empForm.value
    }
    if (this.employee) {
      this.authServ.updateEmployee(emp).subscribe({
        next: (res) => {
          this.save.emit(res.successMessages ? res.successMessages[0] : '');
          this.close.emit()
          if (res.errorMessages) { alert(res.errorMessages) }

        }, error: (err) => { alert('Error fetching company details: ' + err.message); },
      })
    }
    else {
      this.authServ.addNewEmployee(this.empNewForm.value).subscribe({
        next: (res) => {
          if (res.errorMessages) {
            alert(res.errorMessages)
          } else {
            this.save.emit(res.successMessages ? res.successMessages[0] : '');
            this.close.emit()
          }
        }, error: (err) => { alert('Error fetching company details: ' + err.message); },
      })
    }
    this.empForm.disable()
  }


}
