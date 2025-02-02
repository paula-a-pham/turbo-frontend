import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthService } from '../../../../core/services/firebase/auth/firebase-auth.service';
import { ILoginUser } from '../../../../shared/models/iuser';
import { User } from '@angular/fire/auth';
import { ToasterService } from '../../../../core/services/toaster/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  reactiveForm!: FormGroup;
  loading!: boolean;

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private toasterService: ToasterService,
    private firebaseAuthService: FirebaseAuthService
  ) {
    this.initReactiveForm();
    this.loading = false;
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

  resetReactiveFormInputs(): void {
    this.reactiveForm.reset();
    this.reactiveForm.markAllAsTouched();
  }

  disableReactiveFormInputs(): void {
    this.email?.disable();
    this.password?.disable();
  }

  enableReactiveFormInputs(): void {
    this.email?.enable();
    this.password?.enable();
  }

  async logInWithEmailAndPassword(): Promise<void> {
    this.loading = true;
    this.disableReactiveFormInputs();
    const oldUser: ILoginUser = this.reactiveForm.value as ILoginUser;
    try {
      const user: User | null =
        await this.firebaseAuthService.logInWithEmailAndPassword(oldUser);
      this.loading = false;
      if (user) {
        console.log('Done');
        this.router.navigate(['/home'], { replaceUrl: true });
      } else {
        this.toasterService.showError({ message: 'Invalid Login.' });
      }
    } catch (error: any) {
      this.loading = false;
      this.resetReactiveFormInputs();
      this.enableReactiveFormInputs();
      this.toasterService.showError({ message: error.message });
    }
  }
}
