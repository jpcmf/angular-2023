import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Ingredient } from './models/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];

  private ingredientsChangedSubscription: Subscription;

  constructor(private _shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredients = this._shoppingListService.getIngredients();

    this.ingredientsChangedSubscription =
      this._shoppingListService.ingredientsChanged.subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
        }
      );
  }

  ngOnDestroy(): void {
    this.ingredientsChangedSubscription.unsubscribe();
  }

  onEditItem(index: number) {
    this._shoppingListService.startedEditing.next(index);
  }
}
