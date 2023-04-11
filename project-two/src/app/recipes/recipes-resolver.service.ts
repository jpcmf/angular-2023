import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';

import { Recipe } from './models/recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root',
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private _dataStorageSerivce: DataStorageService,
    private _recipesService: RecipeService
  ) {}

  // the Angular will subscribe with resolver
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    const recipes = this._recipesService.getRecipes();
    if (recipes.length === 0) {
      return this._dataStorageSerivce.fetchRecipes();
    } else {
      return recipes;
    }
  }
}
