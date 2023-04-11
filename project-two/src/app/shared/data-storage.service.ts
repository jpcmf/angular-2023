import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private _http: HttpClient,
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
