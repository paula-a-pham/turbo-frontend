import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { ILoginUser, INewUser } from '../../../../shared/models/iuser';
import { catchError, from, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  // inject firebase auth service
  constructor(private auth: Auth) {}

  // create all firebase auth methods as observables
  getCurrentUser(): Observable<User | null> {
    return authState(this.auth).pipe(
      catchError(this.handleAuthErrors.bind(this))
    );
  }

  createUserWithEmailAndPassword(user: INewUser): Observable<UserCredential> {
    return from(
      createUserWithEmailAndPassword(this.auth, user.email, user.password)
    ).pipe(catchError(this.handleAuthErrors.bind(this)));
  }

  logInWithEmailAndPassword(user: ILoginUser): Observable<UserCredential> {
    return from(
      signInWithEmailAndPassword(this.auth, user.email, user.password)
    ).pipe(catchError(this.handleAuthErrors.bind(this)));
  }

  updateCurrentUserEmail(user: User, newEmail: string): Observable<void> {
    return from(updateEmail(user, newEmail)).pipe(
      catchError(this.handleAuthErrors.bind(this))
    );
  }

  updateCurrentUserPassword(user: User, newPassword: string): Observable<void> {
    return from(updatePassword(user, newPassword)).pipe(
      catchError(this.handleAuthErrors.bind(this))
    );
  }

  updateUserDisplayName(user: User, name: string): Observable<void> {
    return from(updateProfile(user, { displayName: name })).pipe(
      catchError(this.handleAuthErrors.bind(this))
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      catchError(this.handleAuthErrors.bind(this))
    );
  }

  // handle auth errors
  handleAuthErrors(error: any): Observable<never> {
    switch (error.code) {
      case 'auth/network-request-failed':
        console.error(error);
        return throwError(
          () =>
            new Error(
              'Please check your internet connection and try again later.'
            )
        );

      case 'auth/invalid-email':
        console.error(error);
        return throwError(() => new Error('Invalid email address.'));

      case 'auth/email-already-in-use':
        console.error(error);
        return throwError(() => new Error('This email already exists.'));

      case 'auth/invalid-credential':
        console.error(error);
        return throwError(() => new Error('Invalid email or password.'));

      default:
        console.error(error);
        return throwError(() => new Error('Unexpected error occured.'));
    }
  }
}
