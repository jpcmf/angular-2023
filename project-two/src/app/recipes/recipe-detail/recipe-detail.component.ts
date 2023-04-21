import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../recipe.service';

import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  visibilityClasses: {};
  private isVisible: boolean = false;

  recipe: Recipe;
  id: number;

  constructor(
    private _recipeService: RecipeService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.setVisibilityClasses();

    this._route.params.subscribe((params: Params) => {
      this.id = +params.id;
      // this.recipe = this._recipeService.getRecipe(this.id);
      this._store
        .select('recipes')
        .pipe(
          map((recipesState) => {
            return recipesState.recipes.find((recipe, index) => {
              return index === this.id;
            });
          })
        )
        .subscribe((recipe) => {
          this.recipe = recipe;
        });
    });
  }

  toggleVisible(isVisible: boolean): void {
    this.isVisible = isVisible;
    this.setVisibilityClasses();
  }

  private setVisibilityClasses(): void {
    this.visibilityClasses = { hidden: !this.isVisible, '': this.isVisible };
  }

  onAddToShoppingList(): void {
    this._recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe(): void {
    this._router.navigate(['edit'], { relativeTo: this._route });
    //alternative to the solution above
    // this._router.navigate(['../', this.id, 'edit'], {
    //   relativeTo: this._route,
    // });
  }

  onDeleteRecipe(): void {
    this._recipeService.deleteRecipe(this.id);
    this._router.navigate(['/recipes']);
  }
}
