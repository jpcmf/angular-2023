import { Action } from '@ngrx/store';
import { Recipe } from '../models/recipe.model';

export const SET_RECIPES = '[Recipes] SET_RECIPES';

export class SetRecipes implements Action {
  readonly type = SET_RECIPES; // type safety

  constructor(public payload: Recipe[]) {}
}

export type RecipeActions = SetRecipes;
