import { Component, OnInit } from '@angular/core';
import { LikeParams } from '../_models/likeParams';
import { Member } from '../_models/Member';
import { Pagination } from '../_models/pagination';
import { MembersService } from '../_services/members.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  members: Partial<Member[]>;
  likeParams: LikeParams;
  pagination: Pagination;

  constructor(private membersService: MembersService) { 
    this.likeParams = new LikeParams()
  }

  ngOnInit(): void {
    this.loadMembers()
  }

  loadMembers() {
    console.log(this.likeParams);
    this.membersService.getLikes(this.likeParams).subscribe((res) => {
      this.members = res.result;
      this.pagination = res.pagination;
    })
  }

  pageChanged(event: any){
    this.likeParams.pageNumber = event.page;
    this.loadMembers()
  }

}
