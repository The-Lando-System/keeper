import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private user: User;

  constructor(
    private authService: AuthService
  ){}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  login(): void {
    this.authService.login()
    .then(() => {
      this.user = this.authService.getUser();
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
