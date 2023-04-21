import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './models/user.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _store: Store<fromApp.AppState>
  ) {}

  // onSignUp(email: string, password: string) {
  //   const API_KEY = environment.apiKey;
  //   const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

  //   return this._http
  //     .post<AuthResponseData>(url, {
  //       email: email,
  //       password: password,
  //       returnSecureToken: true,
  //     })
  //     .pipe(
  //       catchError(this.handleError),
  //       tap((responseData) =>
  //         this.handleAuthentication(
  //           responseData.email,
  //           responseData.localId,
  //           responseData.idToken,
  //           +responseData.expiresIn
  //         )
  //       )
  //     );
  // }

  // onSignIn(email: string, password: string) {
  //   const API_KEY = environment.apiKey;
  //   const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

  //   return this._http
  //     .post<AuthResponseData>(url, {
  //       email: email,
  //       password: password,
  //       returnSecureToken: true,
  //     })
  //     .pipe(
  //       catchError(this.handleError),
  //       tap((responseData) =>
  //         this.handleAuthentication(
  //           responseData.email,
  //           responseData.localId,
  //           responseData.idToken,
  //           +responseData.expiresIn
  //         )
  //       )
  //     );
  // }

  autoSignIn() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('@userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      // this.user.next(loadedUser);
      this._store.dispatch(
        new AuthActions.AuthSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
        })
      );
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  onLogout() {
    // this.user.next(null);
    this._store.dispatch(new AuthActions.Logout());
    // this._router.navigate(['/auth']);

    localStorage.removeItem('@userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    console.log(expirationDuration);

    this.tokenExpirationTimer = setTimeout(() => {
      this.onLogout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    // this.user.next(user);
    this._store.dispatch(
      new AuthActions.AuthSuccess({ email, userId, token, expirationDate })
    );

    this.autoLogout(expiresIn * 1000);

    //...
    //persist user data to the local storage to prevent lost the information when reload page
    //security issue?
    localStorage.setItem('@userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage =
          'The email address is already in use by another account.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage =
          'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage =
          'The password is invalid or the user does not have a password.';
        break;
      default:
        break;
    }
    return throwError(errorMessage);
  }
}
