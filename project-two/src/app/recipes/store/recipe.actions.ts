import { Action } from '@ngrx/store';
import { Recipe } from '../models/recipe.model';

export const SET_RECIPES = '[Recipes] SET_RECIPES';
export const FETCH_RECIPES = '[Recipes] FETCH_RECIPES';

export class SetRecipes implements Action {
  readonly type = SET_RECIPES; // type safety

  constructor(public payload: Recipe[]) {}
}

export class FetchRecipes implements Action {
  readonly type = FETCH_RECIPES; // type safety

  // constructor(public payload: Recipe[]) {}
}

export type RecipeActions = SetRecipes | FetchRecipes;
