import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  sidebarCollapsed!: boolean;
  viewportWidth!: number;

  constructor() {
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
    console.log('Viewport Width:', this.viewportWidth);
  };

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onViewResize);
  }
}
