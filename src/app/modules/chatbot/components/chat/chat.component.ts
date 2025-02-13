import { Component, ElementRef, ViewChild } from '@angular/core';
import { IMessage } from '../../../../shared/models/imessage';
import { MessageRole } from '../../../../shared/enums/message-role';
import { GroqService } from '../../../../core/services/groq/groq.service';
import { IChoice } from '../../../../shared/models/igroq-response';
import { ToasterService } from '../../../../core/services/toaster/toaster.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  animations: [
    trigger('slideIn', [
      state('void', style({ transform: 'translateY(30px)', opacity: 0 })), // Initial state (hidden)
      transition(':enter', [
        animate(
          '100ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class ChatComponent {
  @ViewChild('chatArea') chatArea!: ElementRef;
  messageRole = MessageRole;
  messages: IMessage[] = [];
  userPrompt: string = '';
  waiting: boolean = false;

  constructor(
    private groqService: GroqService,
    private toasterService: ToasterService,
    private sanitizer: DomSanitizer
  ) {}

  adjustTextareaHeight(event: any): void {
    const textarea = event.target;
    const lineHeight = 24;
    const maxLines = 5;
    const maxHeight = lineHeight * maxLines;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = newHeight + 'px';
  }

  safeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  scrollToBottom() {
    const container = this.chatArea.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  onSubmit(): void {
    if (this.userPrompt && !this.waiting) {
      this.waiting = true;

      setTimeout(() => {
        this.scrollToBottom();
      }, 0);

      const newMessage: IMessage = {
        role: this.messageRole.user,
        content: this.userPrompt,
      };

      this.messages.push(newMessage);

      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
      this.userPrompt = '';

      const observer = {
        next: (choices: IChoice[]) => {
          this.waiting = false;

          if (choices && choices.length > 0) {
            const assistantMessage: IMessage = choices[0].message;
            this.messages.push(assistantMessage);

            setTimeout(() => {
              this.scrollToBottom();
            }, 0);
          } else {
            this.toasterService.showError({
              message: 'Something went wrong, try again later!',
            });
          }
        },
        error: (error: any) => {
          this.waiting = false;

          this.toasterService.showError({
            message: 'Something went wrong, try again later!',
          });
        },
      };

      this.groqService.sendRquest(this.messages).subscribe(observer);
    }
  }
}
