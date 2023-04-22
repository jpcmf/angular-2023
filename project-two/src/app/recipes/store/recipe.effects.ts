import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Recipe } from '../models/recipe.model';

import { Store } from '@ngrx/store';
import * as RecipesActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {
  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => {
        const url =
          'https://ng-course-recipe-book-237e4-default-rtdb.firebaseio.com/recipes.json';
        return this._http.get<Recipe[]>(url);
      }),
      map((recipes) => {
        return recipes.map((recipes) => {
          return {
            ...recipes,
            ingredients: recipes.ingredients ? recipes.ingredients : [],
          };
        });
      }),
      map((recipes) => {
        return new RecipesActions.SetRecipes(recipes);
      })
    )
  );

  storeRecipe = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this._store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
          const url =
            'https://ng-course-recipe-book-237e4-default-rtdb.firebaseio.com/recipes.json';

          return this._http.put(url, recipesState.recipes);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private _http: HttpClient,
    private _store: Store<fromApp.AppState> // private _router: Router, // private _authService: AuthService
  ) {}
}
