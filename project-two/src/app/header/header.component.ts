import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  visibilityClasses: {};
  private isVisible: boolean = false;
  userSubscription: Subscription;
  isAuthenticated = false;

  constructor(
    private _dataStorageService: DataStorageService,
    private _authService: AuthService,
    private _store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.setVisibilityClasses();
    // this.userSubscription = this._authService.user.subscribe((user) => {
    //   this.isAuthenticated = !user ? false : true; // we can use !!user
    //   console.log(!user);
    //   console.log(!!user);
    // });

    this.userSubscription = this._store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = !user ? false : true; // we can use !!user
        console.log(!user);
        console.log(!!user);
      });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  toggleVisible(isVisible: boolean): void {
    this.isVisible = isVisible;
    this.setVisibilityClasses();
  }

  private setVisibilityClasses(): void {
    this.visibilityClasses = { hidden: !this.isVisible, '': this.isVisible };
  }

  onSaveData(): void {
    this._dataStorageService.storeRecipes();
  }

  onFetchData(): void {
    // this._dataStorageService.fetchRecipes().subscribe();
    this._store.dispatch(new RecipesActions.FetchRecipes());
  }

  onLogout(): void {
    // this._authService.onLogout();
    this._store.dispatch(new AuthActions.Logout());
  }
}
