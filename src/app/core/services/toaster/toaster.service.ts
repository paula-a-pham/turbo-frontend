import { Injectable } from '@angular/core';
import { IToast } from '../../../shared/interfaces/itoast';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  // declare array for toasts
  toasts!: IToast[];

  // initialize toasts array
  constructor() {
    this.toasts = [];
  }

  // create all toast methods with toast title and class for each toast type
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

  // remove specific toast
  remove(toast: IToast): void {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  // remove all toasts
  clear(): void {
    this.toasts.splice(0, this.toasts.length);
  }
}
