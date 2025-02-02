import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseAuthService } from '../../services/firebase/auth/firebase-auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const firebaseAuthService = inject(FirebaseAuthService);
  const router = inject(Router);

  const user = await firebaseAuthService.getCurrentUser();

  if (user) {
    if (state.url.startsWith('/auth') || state.url.startsWith('/guest')) {
      router.navigate(['/home'], { replaceUrl: true });
      return false;
    }
    return true;
  }

  if (!user) {
    if (state.url.startsWith('/home')) {
      router.navigate(['/guest'], { replaceUrl: true });
      return false;
    }
    return true;
  }

  return false;
};
