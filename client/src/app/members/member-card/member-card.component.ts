import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/Member';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() member: Member

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

}
