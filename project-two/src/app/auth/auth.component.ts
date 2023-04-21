import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert/alert.component';
import { PlaceholderDirective } from '../shared/directives/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode: boolean = true;
  isLoading = false;
  authForm: FormGroup;
  error: string = null;
  private subscription: Subscription;
  private storeSubscription: Subscription;

  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.storeSubscription = this._store
      .select('auth')
      .subscribe((authState) => {
        this.isLoading = authState.loading;
        this.error = authState.authError;

        if (this.error) {
          this.showErrorAlert(this.error);
        }
      });
  }

  onSwithMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(): void {
    console.log(this.authForm.value);
    if (!this.authForm.valid) {
      return;
    }

    this.isLoading = true;

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    // let authObs: Observable<AuthResponseData>;

    if (!this.isLoginMode) {
      // authObs = this._authService.onSignUp(email, password);
      this._store.dispatch(
        new AuthActions.SignupStart({ email: email, password: password })
      );
    } else {
      // authObs = this._authService.onSignIn(email, password);
      this._store.dispatch(
        new AuthActions.LoginStart({ email: email, password: password })
      );
    }

    // authObs.subscribe(
    //   (responseData) => {
    //     console.log(responseData);
    //     this.isLoading = false;
    //     this._router.navigate(['/recipes']);
    //   },
    //   (errorMessage) => {
    //     console.log(errorMessage);
    //     this.error = errorMessage;
    //     this.showErrorAlert(errorMessage);
    //     this.isLoading = false;
    //   }
    // );

    this.authForm.reset();
  }

  onHandleClose() {
    // this.error = null;
    this._store.dispatch(new AuthActions.ClearError());
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }

  private showErrorAlert(message: string) {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef =
      hostViewContainerRef.createComponent<AlertComponent>(AlertComponent);
    componentRef.instance.message = message;
    this.subscription = componentRef.instance.close.subscribe(() => {
      this.subscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
