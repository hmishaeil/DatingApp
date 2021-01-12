import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EditRoleModalComponent } from 'src/app/modal/edit-role-modal/edit-role-modal.component';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  bsModalRef: BsModalRef;

  users: Partial<User[]>;
  constructor(private adminService: AdminService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(res => {
      this.users = res;
    })
  }

  openModalWithComponent(user: User) {

    const initialState = {
      user: user.username,
      roles: user.roles
    };

    this.bsModalRef = this.modalService.show(EditRoleModalComponent, { initialState });
    this.bsModalRef.content.newItemEvent.subscribe(res => {
      this.users.filter(user => user.username === res.username).map(user => user.roles = res.roles);
    })

  }

}
