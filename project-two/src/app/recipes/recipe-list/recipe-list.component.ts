import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Recipe } from '../models/recipe.model';
// import { RecipeService } from '../recipe.service';

import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(
    // private _recipeService: RecipeService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    // this.subscription = this._recipeService.recipesChanges.subscribe(
    //   (recipes: Recipe[]) => {
    //     this.recipes = recipes;
    //   }
    // );
    // this.recipes = this._recipeService.getRecipes();

    this.subscription = this._store
      .select('recipes')
      .pipe(map((recipesState) => recipesState.recipes))
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onNewRecipe() {
    this._router.navigate(['new'], {
      relativeTo: this._route,
    });
  }
}
