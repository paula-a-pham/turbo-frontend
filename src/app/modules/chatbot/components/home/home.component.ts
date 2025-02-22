import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FirebaseAuthService } from '../../../../core/services/firebase/auth/firebase-auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from '../../../../core/services/toaster/toaster.service';
import { User } from '@angular/fire/auth';
import { Subject, takeUntil } from 'rxjs';
import { SubscriptionService } from '../../../../core/services/subscription/subscription.service';
import { IChat, IChatBase } from '../../../../shared/models/ichat';
import { Timestamp } from '@angular/fire/firestore';
import { IMessage } from '../../../../shared/models/imessage';
import { FirestoreService } from '../../../../core/services/firebase/firestore/firestore.service';
import { GroqService } from '../../../../core/services/groq/groq.service';
import { IChoice } from '../../../../shared/models/igroq-response';
import { MessageRole } from '../../../../shared/enums/message-role';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  newChat: boolean = false;
  sidebarCollapsed: boolean = false;
  viewportWidth: number = 0;
  currentUser?: User;
  selectedChat!: IChat;
  chatHistory: IChatBase[] = [];
  messages: IMessage[] = [];

  // create subject that emits a signal when the service is destroyed
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private toasterService: ToasterService,
    private firebaseAuthService: FirebaseAuthService,
    private firestoreService: FirestoreService,
    private subscriptionService: SubscriptionService,
    private groqService: GroqService
  ) {}

  async ngOnInit(): Promise<void> {
    this.getSidebarStatus();

    this.getCurrentUser();

    this.viewportWidth = window.innerWidth;
    if (this.viewportWidth <= 1024) {
      this.sidebarCollapsed = true;
    }
    window.addEventListener('resize', this.onViewResize);
  }

  updateChatName(chatId: string, messages: IMessage[]): void {
    const userMessage: IMessage = {
      role: MessageRole.user,
      content:
        'Give this conversation a very short name without additional information as a normal text.',
    };

    messages.push(userMessage);

    const observer = {
      next: (choices: IChoice[]) => {
        if (choices && choices.length > 0) {
          const assistantMessage: IMessage = choices[0].message;
          let tempElement = document.createElement('div');
          tempElement.innerHTML = assistantMessage.content;
          const chatName: string =
            tempElement.innerText || tempElement.textContent || 'New Chat';
          this.firestoreService.updateChatById(chatId, { name: chatName });
        } else {
          this.toasterService.showError({
            message: 'Something went wrong, try again later!',
          });
        }
      },
      error: (error: any) => {
        this.toasterService.showError({
          message: 'Something went wrong, try again later!',
        });
      },
    };

    this.groqService.sendRquest(this.messages).subscribe(observer);
  }

  newChatChange(): void {
    console.log('clicked');

    if (this.selectedChat.id) {
      this.updateChatName(this.selectedChat.id, this.messages);
      
      this.messages = [];

      this.selectedChat = {
        name: 'New Chat',
        userId: this.currentUser!.uid,
        creationDate: Timestamp.now(),
        lastUpdate: Timestamp.now(),
        messages: [],
      };

      this.newChat = true;

      setTimeout(() => {
        this.newChat = false;
      }, 0);
    } else {
      this.messages = [];
    }
  }

  getSidebarStatus(): void {
    const localStorageValue = localStorage.getItem('sidebar-status');
    if (localStorageValue) {
      this.sidebarCollapsed = JSON.parse(localStorageValue);
    }
  }

  toggleSidebarCollapsing(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    const localStorageValue = JSON.stringify(this.sidebarCollapsed);
    localStorage.setItem('sidebar-status', localStorageValue);
  }

  onViewResize = (): void => {
    this.viewportWidth = window.innerWidth;
  };

  openModal(content: TemplateRef<any>): void {
    this.modalService.open(content);
  }

  openSmallModal(content: TemplateRef<any>): void {
    this.modalService.open(content, {
      size: 'sm',
    });
  }

  onNewMessageDetect(message: IMessage): void {
    console.log(this.selectedChat);

    this.messages = [...this.messages, message];

    this.selectedChat.messages = this.messages;

    if (this.selectedChat.id) {
      const observer = {
        next: () => {},
        error: (error: any) => {},
      };
      this.firestoreService
        .updateChatById(this.selectedChat.id, {
          messages: this.selectedChat.messages,
          lastUpdate: Timestamp.now(),
        })
        .subscribe(observer);
    } else {
      const observer = {
        next: (chatId: string) => {
          this.selectedChat.id = chatId;
          this.firestoreService
            .updateChatById(chatId, { id: chatId })
            .subscribe();
        },
        error: (error: any) => {},
      };
      this.firestoreService
        .createNewChat(this.selectedChat)
        .subscribe(observer);
    }
  }

  getCurrentUser(): void {
    const observer = {
      next: async (user: User | null) => {
        if (user) {
          this.currentUser = user;
          this.selectedChat = {
            name: 'New Chat',
            userId: this.currentUser.uid,
            creationDate: Timestamp.now(),
            lastUpdate: Timestamp.now(),
            messages: [],
          };

          this.firestoreService
            .getAllChatsByUserId(this.currentUser.uid)
            .subscribe({
              next: (chats: IChatBase[]) => {
                this.chatHistory = chats;
                console.log(this.chatHistory);
              },
              error: (error) => {},
            });
        } else {
          this.logout();
        }
      },
      error: (error: any) => {
        this.toasterService.showError({ message: error.message });
      },
    };
    this.firebaseAuthService
      .getCurrentUser()
      .pipe(takeUntil(this.subscriptionService.destroySignal))
      .subscribe(observer);
  }

  getChatById(chatId: string): void {
    this.firestoreService.getChatById(chatId).subscribe({
      next: (chat: IChat) => {
        this.selectedChat = chat;
        this.messages = chat.messages;
      },
      error: (error) => {},
    });
  }

  deleteUser(): void {
    localStorage.clear();
    const observer = {
      next: () => {
        this.modalService.dismissAll();
        this.router.navigate(['/'], { replaceUrl: true });
      },
      error: (error: any) => {
        this.modalService.dismissAll();
        this.toasterService.showError({ message: error.message });
      },
    };
    this.firebaseAuthService
      .deleteUser(this.currentUser!)
      .pipe(takeUntil(this.destroy$))
      .subscribe(observer);
  }

  logout(): void {
    localStorage.clear();
    const observer = {
      next: () => {
        this.modalService.dismissAll();
        this.router.navigate(['/'], { replaceUrl: true });
      },
      error: (error: any) => {
        this.modalService.dismissAll();
        this.toasterService.showError({ message: error.message });
      },
    };
    this.firebaseAuthService
      .logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe(observer);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onViewResize);

    // emit a value to notify subscribers that they should clean up their subscriptions
    this.destroy$.next();

    // complete the subject to release resources and prevent memory leaks
    this.destroy$.complete();
  }
}
