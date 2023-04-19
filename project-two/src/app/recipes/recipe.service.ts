import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

import { Recipe } from './models/recipe.model';
import { Ingredient } from '../shopping-list/models/ingredient.model';

// import { ShoppingListService } from '../shopping-list/shopping-list.service';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipesChanges = new Subject<Recipe[]>();

  // Dummy data
  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Tasty Schnitzel',
  //     'Super-tasty Schnitzel - This is a awesome!',
  //     'https://upload.wikimedia.org/wikipedia/commons/3/39/Recipe.jpg',
  //     [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
  //   ),
  //   new Recipe(
  //     'A test recipe 2',
  //     'This is a simply description',
  //     'https://upload.wikimedia.org/wikipedia/commons/3/39/Recipe.jpg',
  //     [new Ingredient('Buns', 2), new Ingredient('Meat', 1)]
  //   ),
  //   new Recipe(
  //     'A test recipe 3',
  //     '333 This is a simply description',
  //     'https://upload.wikimedia.org/wikipedia/commons/3/39/Recipe.jpg',
  //     [new Ingredient('Buns', 2), new Ingredient('Meat', 1)]
  //   ),
  // ];

  private recipes: Recipe[] = [];

  constructor(
    // private _shoppingListService: ShoppingListService,
    private _store: Store<fromApp.AppState>
  ) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanges.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    // this._shoppingListService.addIngredients(ingredients);
    this._store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanges.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanges.next(this.recipes.slice());
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.recipesChanges.next(this.recipes.slice());
  }
}
