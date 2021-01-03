import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { ignoreElements, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/Member';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';

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

  getMembers(userParams: UserParams) {

    // Create the query string parameters to be consumed by back-end 
    let params = new HttpParams()
    params = params.append("PageNumber", userParams.pageNumber.toString());
    params = params.append("PageSize", userParams.pageSize.toString());
    params = params.append("Gender", userParams.gender.toString());
    params = params.append("MinAge", userParams.minAge.toString());
    params = params.append("MaxAge", userParams.maxAge.toString());
    params = params.append("OrderBy", userParams.orderBy.toString());

    return this.getPaginatedResult<Member[]>(this.baseUrl + 'users', params);
  }

  private getPaginatedResult<T>(url: string, params: HttpParams) {

    let paginatedResult: PaginatedResult<T> = new PaginatedResult<T>()

    return this.httpClient.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get("Pagination") !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get("Pagination"));
        }
        return paginatedResult;
      })
    );
  }

  getMember(username: string) {

    const member = this.members.find(member => member.username === username)
    if (member === undefined) {
      return this.httpClient.get<Member>(this.baseUrl + 'users/' + username, httpOptions);
    } else {
      return of(member)
    }
  }

  updateMember(member: Member) {
    return this.httpClient.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member)
        this.members[index] = member
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.httpClient.put(this.baseUrl + 'users/set-main-photo/' + photoId, {})
  }

  deletePhoto(photoId: number) {
    return this.httpClient.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}
