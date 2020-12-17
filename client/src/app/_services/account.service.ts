import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = "https://localhost:5001/api/"
  user: User;

  userResource = new ReplaySubject<User>(1);
  userResource$ = this.userResource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any){
    return this.http.post(this.baseUrl + "account/login", model).pipe(
      map((res: User) => {
        if(res){
          localStorage.setItem('user', JSON.stringify(res));
          this.userResource.next(res);
        }
      })
    );
  }

  register(model: any){
    return this.http.post(this.baseUrl + "account/register", model).pipe(
      map((res: User)=> {
        if(res){
          localStorage.setItem('user', JSON.stringify(res));
          this.userResource.next(res);
        }
      })
    )
  }

  logout(){
    localStorage.removeItem('user');
    this.userResource.next(null);
  }
}