import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
export class ChatComponent implements OnChanges {
  @Input() isGuestUser: boolean = false;
  @Input() newChat: boolean = false;

  @ViewChild('chatArea') chatArea!: ElementRef;
  @ViewChild('guestLimitModal') guestLimitModal!: ElementRef;

  messageRole = MessageRole;
  messages: IMessage[] = [];
  userPrompt: string = '';
  waiting: boolean = false;

  constructor(
    private groqService: GroqService,
    private toasterService: ToasterService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['newChat'] && this.newChat) {
      this.newChatChange();
      this.newChat = false;
    }
  }

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

  checkForGuestUserLimit(shouldIncrement?: boolean): boolean {
    const stringNumber = localStorage.getItem('guest-messages-number');
    if (stringNumber) {
      const number = +stringNumber;
      if (number > 5) {
        this.userPrompt = '';
        this.openGuestLimitModalModal();
        return true;
      }
      if (shouldIncrement) {
        localStorage.setItem('guest-messages-number', `${number + 1}`);
      }
      return false;
    }
    if (shouldIncrement) {
      localStorage.setItem('guest-messages-number', '1');
    }
    return false;
  }

  newChatChange(): void {
    this.messages = [];
    this.userPrompt = '';
    if (this.isGuestUser) {
      this.checkForGuestUserLimit();
    }
  }

  onSubmit(): void {
    if (this.userPrompt && !this.waiting) {
      if (this.isGuestUser) {
        const limitFinish = this.checkForGuestUserLimit(true);

        if (limitFinish) return;
      }

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

  openGuestLimitModalModal(): void {
    this.modalService.open(this.guestLimitModal);
  }
}
