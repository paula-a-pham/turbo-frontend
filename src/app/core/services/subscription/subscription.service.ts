import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService implements OnDestroy {
  // create subject that emits a signal when the service is destroyed
  private destroy$: Subject<void> = new Subject<void>();

  // create getter method to expose the destroy signal as an observable
  get destroySignal() {
    return this.destroy$.asObservable();
  }

  // called when the service is destroyed
  ngOnDestroy(): void {
    // emit a value to notify subscribers that they should clean up their subscriptions
    this.destroy$.next();

    // complete the subject to release resources and prevent memory leaks
    this.destroy$.complete();
  }
}
