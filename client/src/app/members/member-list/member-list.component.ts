import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/Member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  // members: Member[]
  members$: Observable<Member[]>

  constructor(private membersService: MembersService) { }

  ngOnInit(): void {
    // this.loadMembers()
    this.members$ = this.membersService.getMembers()
  }

  // loadMembers(){
  //   this.membersService.getMembers().subscribe(
  //     res => this.members = res
  //   )
  // }

}
