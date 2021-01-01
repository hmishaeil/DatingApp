import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { ignoreElements, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/Member';
import { PaginatedResult } from '../_models/pagination';

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
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>()

  constructor(private httpClient: HttpClient) { 
  }

  getMembers(page?: number, itemsPerPage?: number){

    // if(this.members.length > 0) return of(this.members);
    let params = new HttpParams()

    if(page !== null && itemsPerPage !== null){
      params = params.append("PageNumber", page.toString())
      params = params.append("PageSize", itemsPerPage.toString())
    }
     
    return this.httpClient.get<Member[]>(this.baseUrl + 'users', {observe: 'response', params}).pipe(
      map(response => {
        this.paginatedResult.result = response.body
        if(response.headers.get("Pagination") !== null){
          this.paginatedResult.pagination = JSON.parse(response.headers.get("Pagination"))
        }
        return this.paginatedResult;
      }
      )
      // map(
      //   res => {
      //     this.members = res
      //     return this.members
      //   }
      // )
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
