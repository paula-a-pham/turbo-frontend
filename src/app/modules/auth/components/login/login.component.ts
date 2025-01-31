import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthService } from '../../../../core/services/firebase/auth/firebase-auth.service';
import { ILoginUser } from '../../../../shared/models/iuser';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  reactiveForm!: FormGroup;

  constructor(
    private formbuilder: FormBuilder,
    private firebaseAuthService: FirebaseAuthService
  ) {
    this.initReactiveForm();
  }

  initReactiveForm(): void {
    this.reactiveForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
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
    const oldUser: ILoginUser = this.reactiveForm.value as ILoginUser;
    const user: User | null =
      await this.firebaseAuthService.logInWithEmailAndPassword(oldUser);

    if (user) {
      console.log('Done');
    } else {
      console.log('Error');
    }
  }
}
