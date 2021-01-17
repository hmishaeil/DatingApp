import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal-content',
  templateUrl: './confirm-modal-content.component.html',
  styleUrls: ['./confirm-modal-content.component.css']
})
export class ConfirmModalContentComponent implements OnInit {

  title: string;
  closeBtnName: string;

   constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
  }

}
