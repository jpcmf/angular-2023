import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) {}

  onSignUp(email: string, password: string) {
    const API_KEY = environment.apiKey;

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

    return this._http.post<AuthResponseData>(url, {
      email: email,
      password: password,
      returnSecureToken: true,
    });
  }

  onSignIn() {}
}
