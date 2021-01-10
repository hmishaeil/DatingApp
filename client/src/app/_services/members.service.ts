import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { ignoreElements, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, getPaginationHeader } from '../_helpers/pagination.helper';
import { LikeParams } from '../_models/likeParams';
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

    let params = getPaginationHeader(userParams.pageNumber, userParams.pageSize);

    params = params.append("Gender", userParams.gender.toString());
    params = params.append("MinAge", userParams.minAge.toString());
    params = params.append("MaxAge", userParams.maxAge.toString());
    params = params.append("OrderBy", userParams.orderBy.toString());

    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params, this.httpClient);
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

  addLike(username: string) {
    return this.httpClient.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(likeParams: LikeParams) {

    let params = getPaginationHeader(likeParams.pageNumber, likeParams.pageSize);
    params = params.append("Predicate", likeParams.predicate);
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + 'likes', params, this.httpClient);
  }

  sendMessage(){
    
  }
}
