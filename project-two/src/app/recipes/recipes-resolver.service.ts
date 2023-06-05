import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';

import { Recipe } from './models/recipe.model';
// import { DataStorageService } from '../shared/data-storage.service';
// import { RecipeService } from './recipe.service';

import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';

import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    // private _dataStorageSerivce: DataStorageService,
    // private _recipesService: RecipeService,
    private _store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  // the Angular will subscribe with resolver
  // resolve(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
  //   const recipes = this._recipesService.getRecipes();
  //   if (recipes.length === 0) {
  //     return this._dataStorageSerivce.fetchRecipes();
  //   } else {
  //     return recipes;
  //   }
  // }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this._store.select('recipes').pipe(
      take(1),
      map((recipesState) => {
        return recipesState.recipes;
      }),
      switchMap((recipes) => {
        if (recipes.length === 0) {
          this._store.dispatch(new RecipesActions.FetchRecipes());
          return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1)
          );
        } else {
          return of(recipes);
        }
      })
    );
  }
}
