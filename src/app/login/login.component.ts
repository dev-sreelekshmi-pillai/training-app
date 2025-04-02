import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { LoginResponse, loginUser, User } from '../model/model';
import { debounceTime, Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  destroyRef = inject(DestroyRef)
  formBuilder = inject(NonNullableFormBuilder)
  router = inject(Router)
  loginServ = inject(AuthService)
  clientId = 'ERPWebApp'
  // successMessage = ''
  errorMessage = '';
  userData!: User
  userId!: string

  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  ngOnInit() {
    const formSubscription = this.loginForm.valueChanges.pipe().subscribe({ next: () => { this.errorMessage = '' } })
    this.destroyRef.onDestroy(() => { formSubscription.unsubscribe() })
  }


  loginUser() {
    let user!: loginUser
    if (this.loginForm.value.username && this.loginForm.value.password) {
      user = { username: this.loginForm.value.username, password: this.loginForm.value.password, clientId: this.clientId }
      this.loginServ.loginUser(user).subscribe({
        next: (userDetailsResponse: LoginResponse) => {
          console.log("userDetailsResponse", userDetailsResponse);
          if (userDetailsResponse.isValid) {
            alert(`User Successfully Logged In`)
            this.userData = userDetailsResponse.data
            console.log(this.userData);
            this.userId = this.userData.id
            this.router.navigate(['/company', this.userData.companyId])
            // this.router.navigate(['/heroes', { id: heroId }]);
            this.loginServ.setTokens(this.userData.token!, this.userData.refreshToken!)
            if (userDetailsResponse.errorMessages) { alert(userDetailsResponse.errorMessages) }
          } else {
            this.errorMessage = userDetailsResponse.errorMessages[0]
          }
        },
        error: (err) => {
          this.errorMessage = err.message;
          alert('Error fetching company details: ' + err.message);
        }
      })
    }


  }


  resetFields() {
    this.loginForm.reset();
    this.errorMessage = '';
    // this.successMessage = ''
  }

}
