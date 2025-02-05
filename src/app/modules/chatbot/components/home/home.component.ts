import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FirebaseAuthService } from '../../../../core/services/firebase/auth/firebase-auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from '../../../../core/services/toaster/toaster.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  sidebarCollapsed!: boolean;
  viewportWidth!: number;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private toasterService: ToasterService,
    private firebaseAuthService: FirebaseAuthService
  ) {
    this.sidebarCollapsed = false;
    this.viewportWidth = 0;
  }

  ngOnInit(): void {
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
