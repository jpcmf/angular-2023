import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Ingredient } from '../models/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;

  constructor(private _shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.subscription = this._shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);

    this._shoppingListService.addIngredient(newIngredient);
  }
}
