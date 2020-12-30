import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/Member';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user'))?.token
  })
}

@Injectable({
  providedIn: 'root'
})

export class MembersService {

  baseUrl = environment.apiUrl
  members: Member[] = []

  constructor(private httpClient: HttpClient) { 
  }

  getMembers(){

    // TODO: Avoid the back-end call for caching mechanism
    // if(this.members.length > 0) return of(this.members);

    return this.httpClient.get<Member[]>(this.baseUrl + 'users').pipe(
      map(
        res => {
          this.members = res
          return this.members
        }
      )
    );
  }

  getMember(username: string){

    const member = this.members.find(member => member.username === username)
    if(member === undefined) {
      return this.httpClient.get<Member>(this.baseUrl + 'users/' + username, httpOptions);
    } else {
      return of(member)
    }
  }

  updateMember(member: Member){
    return this.httpClient.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member)
        this.members[index] = member
      })
    )
  }

  setMainPhoto(photoId: number){
    return this.httpClient.put(this.baseUrl + 'users/set-main-photo/' + photoId, {})
  }

  deletePhoto(photoId: number){
    return this.httpClient.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}
