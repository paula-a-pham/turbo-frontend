import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseAuthService } from '../../../../core/services/firebase/auth/firebase-auth.service';
import { Router } from '@angular/router';

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

  async logout(): Promise<void> {
    await this.firebaseAuthService.logout();
    this.router.navigate(['/'], { replaceUrl: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onViewResize);
  }
}
