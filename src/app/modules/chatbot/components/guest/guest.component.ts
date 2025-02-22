import { Component } from '@angular/core';
import { IMessage } from '../../../../shared/models/imessage';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.css',
})
export class GuestComponent {
  newChat: boolean = false;
  messages: IMessage[] = [];

  newChatChange(): void {
    this.newChat = true;

    setTimeout(() => {
      this.newChat = false;
    }, 0);
  }

  onNewMessageDetect(message: IMessage): void {
    this.messages = [...this.messages, message];
  }
}
