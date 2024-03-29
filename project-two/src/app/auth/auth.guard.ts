import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private _authSevice: AuthService,
    private _router: Router,
    private _store: Store<fromApp.AppState>
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // return this._authSevice.user.pipe(
    //   take(1),
    //   map((user) => {
    //     const isAuth = !!user;

    //     if (isAuth) {
    //       return true;
    //     }

    //     return this._router.createUrlTree(['/auth']);
    //   })
    // );
    return this._store.select('auth').pipe(
      take(1),
      map((authState) => {
        return authState.user;
      }),
      map((user) => {
        const isAuth = !!user;

        if (isAuth) {
          return true;
        }

        return this._router.createUrlTree(['/auth']);
      })
    );
  }
}
