import { Injectable } from '@angular/core';
import {
  Auth,
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

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  constructor(private auth: Auth) {}

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async createUserWithEmailAndPassword(user: INewUser): Promise<User | null> {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(
          this.auth,
          user.email,
          user.password
        );
      if (userCredential.user) {
        await this.updateUserName(userCredential.user, user.name);
        return userCredential.user;
      }
    } catch (error) {
      console.error(error);
      console.error('Unexpected error while creating a new user!');
      const errorMessage: string = this.handleAuthErrors(error);
      throw new Error(errorMessage);
    }
    return null;
  }

  async logInWithEmailAndPassword(user: ILoginUser): Promise<User | null> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.auth,
        user.email,
        user.password
      );
      if (userCredential.user) {
        return userCredential.user;
      }
    } catch (error) {
      console.error(error);
      console.error('Unexpected error while user login!');
      const errorMessage: string = this.handleAuthErrors(error);
      throw new Error(errorMessage);
    }
    return null;
  }

  async updateCurrentUserEmail(user: User, newEmail: string): Promise<void> {
    try {
      await updateEmail(user, newEmail);
    } catch (error) {
      console.error(error);
      console.error('Unexpected error while updating user email!');
      const errorMessage: string = this.handleAuthErrors(error);
      throw new Error(errorMessage);
    }
  }

  async updateCurrentUserPassword(
    user: User,
    newPassword: string
  ): Promise<void> {
    try {
      await updatePassword(user, newPassword);
    } catch (error) {
      console.error(error);
      console.error('Unexpected error while updating user password!');
      const errorMessage: string = this.handleAuthErrors(error);
      throw new Error(errorMessage);
    }
  }

  async updateUserName(user: User, name: string): Promise<void> {
    try {
      await updateProfile(user, { displayName: name });
    } catch (error) {
      console.error(error);
      console.error('Unexpected error while updating user display name!');
      const errorMessage: string = this.handleAuthErrors(error);
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error(error);
      console.error('Unexpected error while log out!');
      const errorMessage: string = this.handleAuthErrors(error);
      throw new Error(errorMessage);
    }
  }

  handleAuthErrors(error: any): string {
    switch (error.code) {
      case 'auth/network-request-failed':
        return 'Please check your internet connection and try again later.';

      case 'auth/invalid-email':
        return 'Invalid email address.';

      case 'auth/email-already-in-use':
        return 'This email already exists.';

      case 'auth/invalid-credential':
        return 'Invalid email or password.';

      default:
        return 'Unexpected error occured.';
    }
  }
}
