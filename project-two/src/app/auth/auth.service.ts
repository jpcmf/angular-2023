import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './models/user.model';
import { Router } from '@angular/router';

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
  user = new BehaviorSubject<User>(null);

  constructor(private _http: HttpClient, private _router: Router) {}

  onSignUp(email: string, password: string) {
    const API_KEY = environment.apiKey;
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

    return this._http
      .post<AuthResponseData>(url, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((responseData) =>
          this.handleAuthentication(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            +responseData.expiresIn
          )
        )
      );
  }

  onSignIn(email: string, password: string) {
    const API_KEY = environment.apiKey;
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

    return this._http
      .post<AuthResponseData>(url, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleError),
        tap((responseData) =>
          this.handleAuthentication(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            +responseData.expiresIn
          )
        )
      );
  }

  onLogout() {
    this.user.next(null);
    this._router.navigate(['/auth']);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
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
