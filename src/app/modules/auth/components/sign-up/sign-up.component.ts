import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthService } from '../../../../core/services/firebase/auth/firebase-auth.service';
import { INewUser } from '../../../../shared/models/iuser';
import { User, UserCredential } from '@angular/fire/auth';
import { ToasterService } from '../../../../core/services/toaster/toaster.service';
import { Router } from '@angular/router';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnDestroy {
  // declare component variables
  reactiveForm!: FormGroup;
  loading!: boolean;

  // create subject that emits a signal when the service is destroyed
  private destroy$: Subject<void> = new Subject<void>();

  // inject needed services and initalize component variables
  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private toasterService: ToasterService,
    private firebaseAuthService: FirebaseAuthService
  ) {
    this.initReactiveForm();
    this.loading = false;
  }

  // define reactive form fields
  initReactiveForm(): void {
    this.reactiveForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  // getters functions for reactive form fields
  get name() {
    return this.reactiveForm.get('name');
  }
  get email() {
    return this.reactiveForm.get('email');
  }
  get password() {
    return this.reactiveForm.get('password');
  }

  // get error messages for reactive form fields based on the field state
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

  // reset reactive form with all fields to the default state
  // and then mark all field as touched to display errors borders incase invalid sign up
  resetReactiveFormInputs(): void {
    this.reactiveForm.reset();
    this.reactiveForm.markAllAsTouched();
  }

  // disable reactive form fields when sign up button clicked to prevent the user from write any thing
  // for accurate sign up process
  disableReactiveFormInputs(): void {
    this.name?.disable();
    this.email?.disable();
    this.password?.disable();
  }

  // enable reactive form fields after invalid account creation to enable the user to sign up again with correct credentials
  enableReactiveFormInputs(): void {
    this.name?.enable();
    this.email?.enable();
    this.password?.enable();
  }

  // start the sign up process
  createUserWithEmailAndPassword(): void {
    this.loading = true;
    this.disableReactiveFormInputs();
    // get reactive form value as an object of new user
    const newUser: INewUser = this.reactiveForm.value as INewUser;

    // define observer actions
    const observer = {
      next: async (userCredential: UserCredential) => {
        this.loading = false;
        if (userCredential.user) {
          await this.updateUserDisplayName(userCredential.user, newUser.name);
          // navigate to the user profile when valid account creation
          this.router.navigate(['/home'], { replaceUrl: true });
        } else {
          this.toasterService.showError({ message: 'Account not created.' });
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.resetReactiveFormInputs();
        this.enableReactiveFormInputs();
        this.toasterService.showError({ message: error.message });
      },
    };

    // subscribe to the login observable
    this.firebaseAuthService
      .createUserWithEmailAndPassword(newUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe(observer);
  }

  // update user display name
  async updateUserDisplayName(user: User, name: string): Promise<void> {
    return lastValueFrom(
      this.firebaseAuthService.updateUserDisplayName(user, name)
    ).catch((error: any) => {
      this.toasterService.showError({ message: error.message });
    });
  }

  ngOnDestroy() {
    // emit a value to notify subscribers that they should clean up their subscriptions
    this.destroy$.next();

    // complete the subject to release resources and prevent memory leaks
    this.destroy$.complete();
  }
}
