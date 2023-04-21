import { Component, OnInit } from '@angular/core';
// import { AuthService } from './auth/auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    // private _authService: AuthService,
    private _store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    // this._authService.autoSignIn();
    this._store.dispatch(new AuthActions.AuthLogin());
  }
}
