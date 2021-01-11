import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-role-modal',
  templateUrl: './edit-role-modal.component.html',
  styleUrls: ['./edit-role-modal.component.css']
})
export class EditRoleModalComponent implements OnInit {

  title: string;
  closeBtnName: string;
  list: any[] = [];

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

}
