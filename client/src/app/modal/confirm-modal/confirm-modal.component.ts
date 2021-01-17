import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit, OnDestroy {

  title: string = 'Confirm';
  body: string = 'Are you sure?';
  cancelBtnName: string = 'Cancel';
  okBtnName: string = 'Ok';

  result: boolean = false;

  confirmModalResultEvent = new EventEmitter<boolean>();

  constructor(public bsModalRef: BsModalRef) { }

  ngOnDestroy(): void {
    this.confirmModalResultEvent.emit(this.result);
  }

  ngOnInit() {
  }

}
