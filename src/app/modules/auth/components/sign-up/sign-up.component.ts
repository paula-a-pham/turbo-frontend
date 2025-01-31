import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthService } from '../../../../core/services/firebase/auth/firebase-auth.service';
import { INewUser, IUser } from '../../../../shared/models/iuser';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  reactiveForm!: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private firebaseAuthService: FirebaseAuthService
  ) {
    this.initReactiveForm();
  }

  initReactiveForm(): void {
    this.reactiveForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get name() {
    return this.reactiveForm.get('name');
  }
  get email() {
    return this.reactiveForm.get('email');
  }
  get password() {
    return this.reactiveForm.get('password');
  }

  getEmailErrorMessage(): string {
    if (this.email?.errors?.['required']) {
      return 'This field required!';
    }
    if (this.email?.errors?.['email']) {
      return 'Email syntax not valid!';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.password?.errors?.['required']) {
      return 'This field required!';
    }
    if (this.password?.errors?.['minlength']) {
      return 'Password should be at min 8 character!';
    }
    return '';
  }

  async createUserWithEmailAndPassword(): Promise<void> {
    const newUser: INewUser = this.reactiveForm.value as INewUser;
    const user: User | null =
      await this.firebaseAuthService.createUserWithEmailAndPassword(newUser);

    if (user) {
      console.log('Done');
    } else {
      console.log('Error');
    }
  }
}
