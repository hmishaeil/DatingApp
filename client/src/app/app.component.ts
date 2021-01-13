import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { PresenceService } from './_services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'The Dating App';

  constructor(private accountService: AccountService, private presenceService: PresenceService) { }
  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user')); // Convert string to json model to be able to assign to the User interface

    if (user) {
      //TODO Check if we need to set the user via account service
      this.presenceService.createHubConnection(user);
    }
  }
}
