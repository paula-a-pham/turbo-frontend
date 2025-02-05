import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FirebaseAuthService } from '../../../../core/services/firebase/auth/firebase-auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from '../../../../core/services/toaster/toaster.service';
import { User } from '@angular/fire/auth';
import { IUser } from '../../../../shared/models/iuser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  sidebarCollapsed!: boolean;
  viewportWidth!: number;
  currentUser!: IUser;

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
    await this.getCurrentUser();

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

  async getCurrentUser(): Promise<void> {
    try {
      const user: User | null = await this.firebaseAuthService.getCurrentUser();
      if (user) {
        this.currentUser = {
          uid: user.uid,
          name: user.displayName!,
          email: user.email!,
        };
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.firebaseAuthService.logout();
      this.modalService.dismissAll();
      this.router.navigate(['/'], { replaceUrl: true });
    } catch (error: any) {
      this.toasterService.showError({ message: error.message });
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onViewResize);
  }
}
