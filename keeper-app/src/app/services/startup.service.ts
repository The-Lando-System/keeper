import { Injectable } from '@angular/core';
import { AuthService, User } from './auth.service';

@Injectable()
export class StartupService {
  
  constructor(
    private authSvc: AuthService
  ) {}

  load(): Promise<User> {
    return this.authSvc.initUser()
      .then(() => null)
      .catch(() => null);
  }

}