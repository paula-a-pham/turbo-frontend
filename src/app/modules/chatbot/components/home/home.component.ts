import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FirebaseAuthService } from '../../../../core/services/firebase/auth/firebase-auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from '../../../../core/services/toaster/toaster.service';
import { User } from '@angular/fire/auth';
import { IUser } from '../../../../shared/models/iuser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  sidebarCollapsed!: boolean;
  viewportWidth!: number;
  currentUser?: IUser;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private toasterService: ToasterService,
    private firebaseAuthService: FirebaseAuthService
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
          subscription.unsubscribe();
        }
      },
      error: (error: any) => {
        this.toasterService.showError({ message: error.message });
        subscription.unsubscribe();
      },
    };
    const subscription: Subscription = this.firebaseAuthService
      .getCurrentUser()
      .subscribe(observer);
  }

  logout(): void {
    const observer = {
      next: () => {
        this.modalService.dismissAll();
        this.router.navigate(['/'], { replaceUrl: true });
        subscription.unsubscribe();
      },
      error: (error: any) => {
        this.modalService.dismissAll();
        this.toasterService.showError({ message: error.message });
        subscription.unsubscribe();
      },
    };
    const subscription: Subscription = this.firebaseAuthService
      .logout()
      .subscribe(observer);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onViewResize);
  }
}
