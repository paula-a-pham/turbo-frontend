import { Injectable } from '@angular/core';
import { IToast } from '../../../shared/interfaces/itoast';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  toasts!: IToast[];

  constructor() {
    this.toasts = [];
  }

  showSuccess(toast: IToast): void {
    toast.title = 'Success';
    toast.className = 'success';
    this.toasts.push(toast);
  }

  showError(toast: IToast): void {
    toast.title = 'Error';
    toast.className = 'error';
    this.toasts.push(toast);
  }

  showWarning(toast: IToast): void {
    toast.title = 'Warning';
    toast.className = 'warning';
    this.toasts.push(toast);
  }

  showInformation(toast: IToast): void {
    toast.title = 'Information';
    toast.className = 'information';
    this.toasts.push(toast);
  }

  showSecondary(toast: IToast): void {
    toast.title = 'Secondary';
    toast.className = 'secondary';
    this.toasts.push(toast);
  }

  remove(toast: IToast): void {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear(): void {
    this.toasts.splice(0, this.toasts.length);
  }
}
