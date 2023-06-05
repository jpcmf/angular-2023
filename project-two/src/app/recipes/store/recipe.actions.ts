import { Action } from '@ngrx/store';
import { Recipe } from '../models/recipe.model';

export const SET_RECIPES = '[Recipes] SET_RECIPES';
export const FETCH_RECIPES = '[Recipes] FETCH_RECIPES';
export const ADD_RECIPE = '[Recipe] ADD_RECIPE';
export const UPDATE_RECIPE = '[Recipe] UPDATE_RECIPE';
export const DELETE_RECIPE = '[Recipe] DELETE_RECIPE';
export const STORE_RECIPES = '[Recipes] STORE_RECIPES';

export class SetRecipes implements Action {
  readonly type = SET_RECIPES; // type safety

  constructor(public payload: Recipe[]) {}
}

export class FetchRecipes implements Action {
  readonly type = FETCH_RECIPES; // type safety
}
export class AddRecipe implements Action {
  readonly type = ADD_RECIPE; // type safety

  constructor(public payload: Recipe) {}
}
export class UpdateRecipe implements Action {
  readonly type = UPDATE_RECIPE; // type safety

  constructor(public payload: { index: number; newRecipe: Recipe }) {}
}
export class DeleteRecipe implements Action {
  readonly type = DELETE_RECIPE; // type safety

  constructor(public payload: number) {}
}

export class StoreRecipes implements Action {
  readonly type = STORE_RECIPES; // type safety
}

export type RecipesActions =
  | SetRecipes
  | FetchRecipes
  | AddRecipe
  | UpdateRecipe
  | DeleteRecipe
  | StoreRecipes;
