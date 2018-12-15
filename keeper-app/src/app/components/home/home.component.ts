import { Component, OnInit } from '@angular/core';
import { AuthService, User } from 'src/app/services/auth.service';
import { Broadcaster } from 'src/app/services/broadcaster';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  private user: User;

  constructor(
    private authService: AuthService,
    private broadcaster: Broadcaster
  ){}
  
  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.listenForLogin();
  }

  listenForLogin(): void {
    this.broadcaster.on("LOGIN").subscribe(() => {
      this.user = this.authService.getUser();
    });
  }
}
