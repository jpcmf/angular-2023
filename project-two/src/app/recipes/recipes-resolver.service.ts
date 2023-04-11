import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';

import { Recipe } from './models/recipe.model';
import { DataStorageService } from '../shared/data-storage.service';

@Injectable({
  providedIn: 'root',
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private _dataStorageSerivce: DataStorageService) {}

  // the Angular will subscribe with resolver
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    return this._dataStorageSerivce.fetchRecipes();
  }
}
