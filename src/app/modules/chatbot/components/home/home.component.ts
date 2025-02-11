import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FirebaseAuthService } from '../../../../core/services/firebase/auth/firebase-auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from '../../../../core/services/toaster/toaster.service';
import { User } from '@angular/fire/auth';
import { IUser } from '../../../../shared/models/iuser';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { SubscriptionService } from '../../../../core/services/subscription/subscription.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  sidebarCollapsed!: boolean;
  viewportWidth!: number;
  currentUser?: IUser;

  // create subject that emits a signal when the service is destroyed
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private toasterService: ToasterService,
    private firebaseAuthService: FirebaseAuthService,
    private subscriptionService: SubscriptionService
  ) {
    this.sidebarCollapsed = false;
    this.viewportWidth = 0;
  }

  async ngOnInit(): Promise<void> {
    this.getCurrentUser();

    this.viewportWidth = window.innerWidth;
    if (this.viewportWidth <= 1024) {
      this.sidebarCollapsed = true;
    }
    window.addEventListener('resize', this.onViewResize);
  }

  toggleSidebarCollapsing(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  onViewResize = (): void => {
    this.viewportWidth = window.innerWidth;
  };

  openModal(content: TemplateRef<any>): void {
    this.modalService.open(content, {
      modalDialogClass: 'custom-modal',
    });
  }

  openSmallModal(content: TemplateRef<any>): void {
    this.modalService.open(content, {
      modalDialogClass: 'custom-modal',
      size: 'sm',
    });
  }

  getCurrentUser(): void {
    const observer = {
      next: async (user: User | null) => {
        if (user) {
          this.currentUser = user as IUser;
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

  logout(): void {
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
