import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Ingredient } from '../models/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;
  @ViewChild('f', { static: false }) shoppingListForm: NgForm;

  constructor(
    private _shoppingListService: ShoppingListService,
    private _store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}

  ngOnInit(): void {
    this.subscription = this._shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this._shoppingListService.getIngredient(index);
        console.log(this.editedItem);
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);

    if (this.editMode) {
      // this._shoppingListService.updateIngredient(
      //   this.editedItemIndex,
      //   newIngredient
      // );
      this._store.dispatch(
        new ShoppingListActions.UpdateIngredient({
          index: this.editedItemIndex,
          ingredient: newIngredient,
        })
      );
    } else {
      // this._shoppingListService.addIngredient(newIngredient);
      this._store.dispatch(
        new ShoppingListActions.AddIngredient(newIngredient)
      );
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.onClear();
    // this._shoppingListService.deleteIngredient(this.editedItemIndex);
    this._store.dispatch(
      new ShoppingListActions.DeleteIngredient(this.editedItemIndex)
    );
  }
}
