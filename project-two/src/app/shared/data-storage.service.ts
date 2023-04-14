import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { exhaustMap, map, take, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/models/recipe.model';
import { AuthService } from '../auth/auth.service';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private _http: HttpClient,
    private _authService: AuthService,
    private _recipeService: RecipeService
  ) {}

  storeRecipes() {
    const recipes = this._recipeService.getRecipes();

    const url =
      'https://ng-course-recipe-book-237e4-default-rtdb.firebaseio.com/recipes.json';

    return this._http.put(url, recipes).subscribe((response) => {
      console.log(response);
    });
  }

  fetchRecipes() {
    const url =
      'https://ng-course-recipe-book-237e4-default-rtdb.firebaseio.com/recipes.json';

    return this._http.get<Recipe[]>(url).pipe(
      map((recipes) => {
        return recipes.map((recipes) => {
          return {
            ...recipes,
            ingredients: recipes.ingredients ? recipes.ingredients : [],
          };
        });
      }),
      tap((recipes) => {
        this._recipeService.setRecipes(recipes);
      })
    );
  }
}
