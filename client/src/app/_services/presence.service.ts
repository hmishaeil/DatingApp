import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;

  // Use BehaviorSubject to initialize with the value
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toastrService: ToastrService) {

  }

  // Here, we are not able to use the HttpInterceptor to attach the token to the header 
  // as the protocol for the HubConx is WebSocket and not http
  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder().withUrl(this.hubUrl + 'presence', {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
      accessTokenFactory: () => user.token
    }).withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information).build();

    // Start the HubConx
    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', username => this.toastrService.info(username + ' is Online!'));
    this.hubConnection.on('UserIsOffline', username => this.toastrService.warning(username + ' is Offline!'));
    this.hubConnection.on('GetOnlineUsers', usernames => this.onlineUsersSource.next(usernames));

  }

  stopHubConnection() {
    this.hubConnection?.stop().catch(error => console.log(error));
  }


}
