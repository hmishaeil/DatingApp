import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserManagementComponent } from 'src/app/admin/user-management/user-management.component';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-edit-role-modal',
  templateUrl: './edit-role-modal.component.html',
  styleUrls: ['./edit-role-modal.component.css']
})
export class EditRoleModalComponent implements OnInit {

  newItemEvent = new EventEmitter<Partial<User>>();

  user: string;
  roles: string[] = [];
  appRoles: any;

  constructor(public bsModalRef: BsModalRef, private adminService: AdminService) { }

  ngOnInit(): void {
    this.appRoles =
      [
        { Name: 'Admin', Value: 'Admin', Checked: this.roles.includes('Admin') },
        { Name: 'Moderator', Value: 'Moderator', Checked: this.roles.includes('Moderator') },
        { Name: 'Member', Value: 'Member', Checked: this.roles.includes('Member') },
      ];
  }

  editRoles() {
    let userDesiredRoles = [];

    this.appRoles.forEach(role => {
      if (role.Checked) userDesiredRoles.push(role.Name);
    });

    console.log(userDesiredRoles);
    this.adminService.editUserRoles(this.user, userDesiredRoles.join(',')).subscribe(
      res => {

        console.log(res);

        let user: Partial<User> = {}
        user.username = this.user;
        user.roles = res; // read from the server response

        this.newItemEvent.emit(user);

        this.bsModalRef.hide()
      }
    )
  }

}
