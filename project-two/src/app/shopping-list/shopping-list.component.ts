import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Ingredient } from './models/ingredient.model';
// import { ShoppingListService } from './shopping-list.service';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  // private ingredientsChangedSubscription: Subscription;

  constructor(
    // private _shoppingListService: ShoppingListService,
    private _store: Store<fromShoppingList.AppState>
  ) {}

  ngOnInit(): void {
    this.ingredients = this._store.select('shoppingList');

    // this.ingredients = this._shoppingListService.getIngredients();

    // this.ingredientsChangedSubscription =
    //   this._shoppingListService.ingredientsChanged.subscribe(
    //     (ingredients: Ingredient[]) => {
    //       this.ingredients = ingredients;
    //     }
    //   );
  }

  ngOnDestroy(): void {
    // this.ingredientsChangedSubscription.unsubscribe();
  }

  onEditItem(index: number) {
    // this._shoppingListService.startedEditing.next(index);
    this._store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
