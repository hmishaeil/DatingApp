import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/Member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  members: Member[];
  pagination: Pagination;
  user: User;
  userParams: UserParams;
  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ]

  constructor(private accountService: AccountService, private membersService: MembersService) {
    this.accountService.userResource$.pipe(take(1)).subscribe(res => this.user = res);
    this.userParams = new UserParams(this.user);
  }

  ngOnInit(): void {
    this.loadMembers()
  }

  resetFilters() {
    this.userParams = new UserParams(this.user);
    this.loadMembers();
  }

  loadMembers() {
    //TODO: Cache the data to avoid unnecessary api calls to get a specific user
    console.log(Object.values(this.userParams).join(' + '));
    this.membersService.getMembers(this.userParams).subscribe(
      response => {
        this.members = response.result
        this.pagination = response.pagination
      }
    )
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.loadMembers()
  }

}
