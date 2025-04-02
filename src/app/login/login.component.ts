import { Component, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { LoginResponse, loginUser, User } from '../model/model';

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
  authServ = inject(AuthService)
  clientId = 'ERPWebApp'
  errorMessage = '';
  userData!: User
  userId!: string

  userDataSignal: Signal<User | null>;

  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor() { this.userDataSignal = this.authServ.UserData; }

  ngOnInit() {
    const formSubscription = this.loginForm.valueChanges.pipe().subscribe({ next: () => { this.errorMessage = '' } })
    this.destroyRef.onDestroy(() => { formSubscription.unsubscribe() })
    console.log(this.userDataSignal());
    if (this.userDataSignal()) {
      this.router.navigate(['/company', this.userDataSignal()?.companyId]);
    }
  }

  loginUser() {
    let user!: loginUser
    if (this.loginForm.value.username && this.loginForm.value.password) {
      user = { username: this.loginForm.value.username, password: this.loginForm.value.password, clientId: this.clientId }
      this.authServ.loginUser(user).subscribe({
        next: (userDetailsResponse: LoginResponse) => {
          if (userDetailsResponse.isValid) {
            alert(`User Successfully Logged In`)
            this.userData = userDetailsResponse.data
            this.userId = this.userData.id
            this.router.navigate(['/company', this.userData.companyId])
            this.authServ.setTokens(this.userData)
            if (userDetailsResponse.errorMessages) {
              alert(userDetailsResponse.errorMessages)
            }
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
  }

}
