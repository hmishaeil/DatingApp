import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/Member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  member: Member
  user: User = null
  formDetail: NgForm

  @ViewChild('memberFormUpdate') f: NgForm
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any){
    if(this.f.dirty){
      $event.returnValue = true
    }
  }

  constructor(private membersService: MembersService, 
    private accountService: AccountService, 
    private toastrService: ToastrService,
    ) { 
    this.accountService.userResource$.pipe(
      take(1)
    ).subscribe(
      res => this.user = res
    );

  }

  ngOnInit(): void {
    this.loadMember()
  }

  loadMember(){
    this.membersService.getMember(this.user.username).subscribe(
      res => this.member = res
    )
  }

  updateMember(){
    this.membersService.updateMember(this.member).subscribe(() => {
      this.toastrService.success('Profile updated!')
      this.f.reset(this.member)
    })
  }

  memberFormChanged(form: NgForm){
    this.formDetail = form
  }
}
