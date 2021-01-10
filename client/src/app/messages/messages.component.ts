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
  loading = false;

  constructor(private messageService: MessageService) {
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
    this.messageService.deleteMessage(id).subscribe(
      () => {
        // For findIndex function, provide the predicate
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
      }
    );
  }

}
