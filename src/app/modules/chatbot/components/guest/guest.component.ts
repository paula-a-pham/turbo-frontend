import { Component } from '@angular/core';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrl: './guest.component.css',
})
export class GuestComponent {
  newChat: boolean = false;

  newChatChange(): void {
    this.newChat = true;

    setTimeout(() => {
      this.newChat = false;
    }, 0);
  }
}
