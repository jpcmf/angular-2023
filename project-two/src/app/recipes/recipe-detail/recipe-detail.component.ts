import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  visibilityClasses: {};
  private isVisible: boolean = false;

  @Input() recipe: Recipe;

  constructor(private _recipeService: RecipeService) {}

  ngOnInit(): void {
    this.setVisibilityClasses();
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
}
