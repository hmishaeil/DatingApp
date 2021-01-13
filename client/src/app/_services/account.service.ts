import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;

  user: User;

  userResource = new ReplaySubject<User>(1);
  userResource$ = this.userResource.asObservable();

  constructor(private http: HttpClient, private presenceService: PresenceService) { }

  login(model: any) {
    return this.http.post(this.baseUrl + "account/login", model).pipe(
      map((res: User) => {
        if (res) {
          // localStorage.setItem('user', JSON.stringify(res));
          // this.userResource.next(res);
          this.setCurrentUser(res);
          this.presenceService.createHubConnection(res);
        }
      })
    );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + "account/register", model).pipe(
      map((res: User) => {
        if (res) {
          localStorage.setItem('user', JSON.stringify(res));
          this.userResource.next(res);
          this.setCurrentUser(res);

        }
      })
    )
  }

  setCurrentUser(user: User) {

    user.roles = [];

    const roles = this.getTokenInfo(user.token).role;

    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.userResource.next(user) // Call the next to trigger the event, otherwise the subscribers won't be noticed.
  }

  logout() {
    localStorage.removeItem('user');
    this.userResource.next(null);
    this.presenceService.stopHubConnection();

  }

  getTokenInfo(token: string) {
    return JSON.parse(atob(token.split('.')[1])); // To access to payload of the token, 0 for header, 1 for payload, and 2 for signature
  }
}
