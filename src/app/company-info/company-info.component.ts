import { afterNextRender, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { companyInfo, LoginResponse } from '../model/model';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './company-info.component.html',
  styleUrl: './company-info.component.css'
})
export class CompanyInfoComponent implements OnInit {
  destroyRef = inject(DestroyRef)
  aR = inject(ActivatedRoute)
  authServ = inject(AuthService)
  fb = inject(FormBuilder)
  infoForm!: FormGroup
  initialFormData!: {}
  isFormEditable = false;
  successmsg = ''
  companyInfo!: companyInfo
  companyId = ''
  constructor() { }

  ngOnInit() {
    this.aR.paramMap.subscribe((params: ParamMap) => {
      if (params.get('cid')) {
        this.companyId = String(params.get('cid'))
      }
      this.getCompanyInfo();
    })
  }

  getCompanyInfo() {
    this.authServ.getCompanyInfo(this.companyId).subscribe({
      next: (response: LoginResponse) => {
        this.companyInfo = response.data;
        this.infoForm = this.fb.group({
          addressLine1: this.companyInfo.addressLine1,
          addressLine2: this.companyInfo.addressLine2,
          zipCode: this.companyInfo.zipCode,
          phoneNo1: this.companyInfo.phoneNo1,
          phoneNo2: this.companyInfo.phoneNo2,
          emailId: this.companyInfo.emailId,
        })
        this.initialFormData = this.infoForm.value
        this.infoForm.disable();
        if (response.errorMessages) { alert(response.errorMessages) }
      }
      , error: (err) => { alert('Error fetching company details: ' + err.message); }
    })
  }

  editCompanyDetails() {
    this.isFormEditable = !this.isFormEditable
    if (this.isFormEditable) {
      this.infoForm.enable();
      this.successmsg = ''
    } else {
      this.updateCompanyDetails()
      this.infoForm.disable()
    }
  }

  updateCompanyDetails() {
    if (JSON.stringify(this.initialFormData) !== JSON.stringify(this.infoForm.value)) {
      this.companyInfo = { ...this.companyInfo, ...this.infoForm.value }
      this.isFormEditable = false
      this.authServ.editCompanyInfo(this.companyInfo).subscribe({
        next: (response: LoginResponse) => {
          this.infoForm.setValue({
            addressLine1: this.companyInfo.addressLine1,
            addressLine2: this.companyInfo.addressLine2,
            zipCode: this.companyInfo.zipCode,
            phoneNo1: this.companyInfo.phoneNo1,
            phoneNo2: this.companyInfo.phoneNo2,
            emailId: this.companyInfo.emailId,
          })
          this.successmsg = response.successMessages ? response.successMessages[0] : ''
          if (response.errorMessages) { alert(response.errorMessages) }
        }
        , error: (err) => { alert('Error fetching company details: ' + err.message); }
      })


      this.initialFormData = this.infoForm.value
    }



  }

  cancelChanges() {
    this.infoForm.setValue({
      addressLine1: this.companyInfo.addressLine1,
      addressLine2: this.companyInfo.addressLine2,
      zipCode: this.companyInfo.zipCode,
      phoneNo1: this.companyInfo.phoneNo1,
      phoneNo2: this.companyInfo.phoneNo2,
      emailId: this.companyInfo.emailId,
    })
    this.isFormEditable = !this.isFormEditable
    this.infoForm.disable()
  }

}
