import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Broadcaster } from './broadcaster';
import { Globals } from '../globals';
import 'rxjs/add/operator/toPromise';

declare const gapi: any;

export const LOGIN_EVENT = 'USER_LOGIN';

@Injectable()
export class AuthService {

  private user: User;
  private accessToken: string;
  private clientIdUrl = Globals.ServiceDomain + '/google/client-id';
  private logoutUrl = 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=' + Globals.ThisDomain;
  private verifyTokenUrl = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
  private googleClientId: string;

  constructor(
    private http: HttpClient,
    private broadcaster: Broadcaster
  ){
    this.user = this.getUser();
    this.accessToken = this.getAccessToken();
    this.getClientId()
    .then((id) => {
      this.googleClientId = id;
      this.user = this.getUser();
      this.accessToken = this.getAccessToken();
      setInterval(() => {
        console.log('Refreshing the OAuth2 access token');
        this.refreshToken();
      },60000);
    });
  }

  // Public methods ===============================

  initUser(): Promise<User> {
    return new Promise<User>((resolve,reject) => {

      this.getClientId()
      .then((id) => {
        this.googleClientId = id;

        if (!this.user || !this.accessToken) {
          console.log('No user or access token saved in local storage... rejecting');
          this.clearUser();
          reject();
          return;
        }

        this.verifyToken(this.accessToken)
          .then(() => resolve())
          .catch(() => reject());

      });

    });
  }

  login(): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      this.loadGoogleAuth()
      .then(() => {
        
        this.signIn();
        
        this.listenForAuth()
          .then(() => resolve())
          .catch(() => reject());

      }).catch(() => reject());
    });
  }

  logout(): void {
    this.clearUser();
    document.location.href = this.logoutUrl;
  }

  refreshToken(): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      if (!this.user) {
        console.log('No user in local storage, rejecting the login refresh...');
        this.clearUser();
        reject();
        return;
      }

      this.loadGoogleAuth()
      .then(() => {

        this.refreshAccessToken()
          .then(() => resolve())
          .catch(() => reject());

      }).catch(() => reject());
    });
  }

  getUser(): User {
    return this.user || JSON.parse(localStorage.getItem('currentUser'));
  }

  getAccessToken(): string {
    return this.accessToken || localStorage.getItem('access_token');
  }

  createAuthHeaders(): HttpHeaders {
    return new HttpHeaders ({
      'Content-Type'   : 'application/json',
      'x-access-token' : this.getAccessToken()
    });
  }

  // Helper methods ===============================

  private refreshAccessToken(): Promise<void> {
    return new Promise<void>((resolve,reject) => {
      gapi.auth2.getAuthInstance().currentUser.get()
      .reloadAuthResponse().then((authResponse) => {
        this.accessToken = authResponse.access_token;
        resolve();
      }, (err:any) => {
        console.log('Error reloading the auth2 instance!');
        console.log(err);
        reject();
      });
    });
  }

  private verifyToken(token:string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post(this.verifyTokenUrl + token, {}, null)
      .toPromise()
      .then((tokenInfo:any) => {

        if (!tokenInfo || !tokenInfo.email) {
          console.log('No email in the token info response... rejecting');
          this.clearUser();
          reject();
          return;
        }

        if (this.user && this.user.email === tokenInfo.email) {
          console.log('Successfully verified the token!')
          resolve();
          return;
        }

        console.log('Unknown error verifying the token...');
        this.clearUser();
        reject();
        return;

      }).catch((error:any) => {

        let err = error.json();

        console.log('Failed to verify the access token...');

        if (!err.hasOwnProperty('error') || err.error !== 'invalid_token') {
          console.log('Not attempting to refresh token..  Error was not an invalid token error');
          this.clearUser();
          reject();
          return;
        }

        this.refreshToken()
        .then(() => {
          console.log('Successfully refreshed the token');
          resolve();
          return;
        }).catch(() => {
          console.log('Unknown error occurred during request.. rejecting');
          this.clearUser();
          reject();
        });

      });
    });
  }

  private loadGoogleAuth(): Promise<void> {
    return new Promise<void>((resolve,reject) => {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: this.googleClientId,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        }).then(() => {
          resolve();
        }, (err:any) => {
          console.log('Error initializing auth2 client!');
          console.log(err);
          reject();
        });
      }, (err:any) => {
        console.log('Error loading the auth2 client!');
        console.log(err);
        reject();
      });
    });
  }

  private signIn(): void {
    gapi.auth2.getAuthInstance().signIn();
  }

  private listenForAuth(): Promise<void> {
    return new Promise<void>((resolve,reject) => {
      gapi.auth2.getAuthInstance().currentUser.listen((userDetails) => {
        if (!userDetails) {
          console.log('No user details... rejecting')
          reject();
        }

        let profile = userDetails.getBasicProfile();
        if (!userDetails) {
          console.log('No profile in the user details... rejecting');
          reject();
        }

        // Set the user and access token
        this.user = new User(
          profile.getName(),
          profile.getEmail(),
          profile.getImageUrl()
        );
        this.accessToken = userDetails.getAuthResponse().access_token;
        
        this.storeUserInfo();

        console.log('Login success!');
        this.broadcaster.broadcast(LOGIN_EVENT);
        resolve();
      });
    });
  }

  private clearUser(): void {
    this.user = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
  }

  private storeUserInfo(): void {
    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        name: this.user.name,
        email: this.user.email,
        profilePic: this.user.profilePic
      })
    );
    localStorage.setItem('access_token', this.accessToken);
  }

  private getClientId(): Promise<string> {
    return this.http.get(this.clientIdUrl)
    .toPromise()
    .then((res:any) => {
      return res.client_id;
    }).catch((err:any) => { console.log(err); });
  }

}

export class User {
  name: string;
  email: string;
  profilePic: string;

  constructor(name:string, email:string, profilePic: string) {
    this.name = name;
    this.email = email;
    this.profilePic = profilePic;
  }
}
