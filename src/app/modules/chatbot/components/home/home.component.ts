import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FirebaseAuthService } from '../../../../core/services/firebase/auth/firebase-auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from '../../../../core/services/toaster/toaster.service';
import { User } from '@angular/fire/auth';
import { Subject, takeUntil } from 'rxjs';
import { SubscriptionService } from '../../../../core/services/subscription/subscription.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  sidebarCollapsed: boolean = false;
  viewportWidth: number = 0;
  currentUser?: User;

  // create subject that emits a signal when the service is destroyed
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private toasterService: ToasterService,
    private firebaseAuthService: FirebaseAuthService,
    private subscriptionService: SubscriptionService
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

  getCurrentUser(): void {
    const observer = {
      next: async (user: User | null) => {
        if (user) {
          this.currentUser = user;
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
