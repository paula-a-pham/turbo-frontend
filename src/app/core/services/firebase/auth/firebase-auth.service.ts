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

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  constructor(private auth: Auth) {}

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async createUserWithEmailAndPassword(
    name: string,
    email: string,
    password: string
  ): Promise<User | null> {
    try {
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        await this.updateUserName(userCredential.user, name);
        return userCredential.user;
      }
    } catch (error) {
      console.error('Unexpected error while creating a new user!');
    }
    return null;
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<User | null> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      if (userCredential.user) {
        return userCredential.user;
      }
    } catch (error) {
      console.error('Unexpected error while user login!');
    }
    return null;
  }

  async updateCurrentUserEmail(user: User, newEmail: string): Promise<void> {
    try {
      await updateEmail(user, newEmail);
    } catch (error) {
      console.error('Unexpected error while updating user email!');
    }
  }

  async updateCurrentUserPassword(
    user: User,
    newPassword: string
  ): Promise<void> {
    try {
      await updatePassword(user, newPassword);
    } catch (error) {
      console.error('Unexpected error while updating user password!');
    }
  }

  async updateUserName(user: User, name: string): Promise<void> {
    try {
      await updateProfile(user, { displayName: name });
    } catch (error) {
      console.error('Unexpected error while updating user display name!');
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Unexpected error while log out!');
    }
  }
}
