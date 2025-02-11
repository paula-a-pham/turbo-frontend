import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseAuthService } from '../../services/firebase/auth/firebase-auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  // inject needed services
  const firebaseAuthService = inject(FirebaseAuthService);
  const router = inject(Router);

  // get current user
  const user = await firstValueFrom(firebaseAuthService.getCurrentUser());

  // check if user is authenticated
  if (user) {
    // check if user opened auth or guest page and redirect him to home
    if (state.url.startsWith('/auth') || state.url.startsWith('/guest')) {
      router.navigate(['/home'], { replaceUrl: true });
      return false;
    }
    return true;
  }

  if (!user) {
    // check if user opened home page and redirect him to guest
    if (state.url.startsWith('/home')) {
      router.navigate(['/guest'], { replaceUrl: true });
      return false;
    }
    return true;
  }

  return false;
};
