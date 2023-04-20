import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { environment } from 'src/environments/environment';
import * as AuthActions from './auth.actions';
import { of } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  authLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        const API_KEY = environment.apiKey;
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

        return this._http
          .post<AuthResponseData>(url, {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          })
          .pipe(
            map((resData) => {
              const expirationDate = new Date(
                new Date().getTime() + +resData.expiresIn * 1000
              );
              return new AuthActions.Login({
                email: resData.email,
                userId: resData.localId,
                token: resData.idToken,
                expirationDate: expirationDate,
              });
            }),
            catchError((errorResponse) => {
              let errorMessage = 'An unknown error occurred!';
              if (!errorResponse.error || !errorResponse.error.error) {
                return of(new AuthActions.LoginFail(errorMessage));
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
              return of(new AuthActions.LoginFail(errorMessage));
            })

            // map((resData) => {
            //   const expirationDate = new Date(
            //     new Date().getTime() + +resData.expiresIn * 1000
            //   );
            //   return new AuthActions.Login({
            //     email: resData.email,
            //     userId: resData.localId,
            //     token: resData.idToken,
            //     expirationDate: expirationDate,
            //   });
            // })
          );
      })
    )
  );

  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap(() => {
          this._router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private _http: HttpClient,
    private _router: Router
  ) {}
}
