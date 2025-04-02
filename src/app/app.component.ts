import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  loginserv = inject(AuthService)
  router = inject(Router)
  ngOnInit() {

    if (localStorage.getItem('aToken')) {
      this.loginserv.setTokens(localStorage.getItem('aToken')!, localStorage.getItem('rToken')!)
    }
    else {
      this.router.navigate([`/login`])
    }
  }

}
