import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { Broadcaster } from 'src/app/services/broadcaster';

@Component({
  selector: 'my-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User;

  constructor(
    private authService: AuthService,
    private broadcaster: Broadcaster
  ){}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  login(): void {
    this.authService.login()
    .then(() => {
      this.user = this.authService.getUser();
      this.broadcaster.broadcast('LOGIN', true);
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
