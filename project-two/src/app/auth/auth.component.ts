import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;
  authForm: FormGroup;

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
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

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    if (!this.isLoginMode) {
      this._authService.onSignUp(email, password).subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      //...
    }

    this.authForm.reset();
  }
}
