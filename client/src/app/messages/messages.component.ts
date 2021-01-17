import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from '../modal/confirm-modal/confirm-modal.component';
import { Message } from '../_models/message';
import { MessageParams } from '../_models/messageParams';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[] = [];
  pagination: Pagination;
  messageParams: MessageParams = new MessageParams();
  loading = false;

  bsModalRef: BsModalRef;
  confirmModalResult: boolean;

  constructor(private messageService: MessageService,
    private modalService: BsModalService) {
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.messageParams).subscribe(res => {
      this.pagination = res.pagination;
      this.messages = res.result;
      this.loading = false;
    })
  }

  pageChanged(event: any) {
    this.messageParams.pageNumber = event.page;
    this.loadMessages();
  }

  deleteMessage(id: number) {
    const initialState = {};
    // this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef = this.modalService.show(ConfirmModalComponent, { initialState });
    this.bsModalRef.content.confirmModalResultEvent.subscribe((res: boolean) => {
      if (res) {
        this.messageService.deleteMessage(id).subscribe(
          () => {
            // For findIndex function, provide the predicate
            this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
          }
        );
      }
    })
  }
}
