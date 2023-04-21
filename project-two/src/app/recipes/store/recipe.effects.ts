import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Recipe } from '../models/recipe.model';

import * as RecipesActions from './recipe.actions';

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

  constructor(
    private actions$: Actions,
    private _http: HttpClient // private _router: Router, // private _authService: AuthService
  ) {}
}
