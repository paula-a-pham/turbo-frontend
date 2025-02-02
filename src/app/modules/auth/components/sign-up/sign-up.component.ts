import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthService } from '../../../../core/services/firebase/auth/firebase-auth.service';
import { INewUser, IUser } from '../../../../shared/models/iuser';
import { User } from '@angular/fire/auth';
import { ToasterService } from '../../../../core/services/toaster/toaster.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
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

  resetReactiveFormInputs(): void {
    this.reactiveForm.reset();
    this.reactiveForm.markAllAsTouched();
  }

  disableReactiveFormInputs(): void {
    this.name?.disable();
    this.email?.disable();
    this.password?.disable();
  }

  enableReactiveFormInputs(): void {
    this.name?.enable();
    this.email?.enable();
    this.password?.enable();
  }

  async createUserWithEmailAndPassword(): Promise<void> {
    this.loading = true;
    this.disableReactiveFormInputs();
    const newUser: INewUser = this.reactiveForm.value as INewUser;
    try {
      const user: User | null =
        await this.firebaseAuthService.createUserWithEmailAndPassword(newUser);
      this.loading = false;
      if (user) {
        this.router.navigate(['/home'], { replaceUrl: true });
      } else {
        this.toasterService.showError({ message: 'Account not created.' });
      }
    } catch (error: any) {
      this.loading = false;
      this.resetReactiveFormInputs();
      this.enableReactiveFormInputs();
      this.toasterService.showError({ message: error.message });
    }
  }
}
