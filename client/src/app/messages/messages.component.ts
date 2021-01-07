import { Component, OnInit } from '@angular/core';
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

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages(this.messageParams).subscribe(res => {
      this.pagination = res.pagination;
      this.messages = res.result;
    })
  }

  pageChanged(event: any) {
    this.messageParams.pageNumber = event.page;
    this.loadMessages();
  }

}
