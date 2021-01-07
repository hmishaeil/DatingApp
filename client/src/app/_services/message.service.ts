import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, getPaginationHeader } from '../_helpers/pagination.helper';
import { Message } from '../_models/message';
import { MessageParams } from '../_models/messageParams';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = environment.apiUrl

  constructor(private httpClient: HttpClient) { }

  getMessages(messageParams: MessageParams){
    let params = getPaginationHeader(messageParams.pageNumber, messageParams.pageSize);
    params = params.append('Container', messageParams.container);

    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.httpClient);
  }
}
