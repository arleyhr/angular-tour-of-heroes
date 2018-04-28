import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: string[] = this.messageService.messages;

  constructor(private messageService: MessageService) { }

  ngOnInit() {
  }

  clear(): void {
    this.messageService.clear();
  }

}
