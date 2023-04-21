import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';

import * as fromApp from '../../store/app.reducer';

import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode: boolean = false;
  recipeForm: FormGroup;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _recipeService: RecipeService,
    private _store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params: Params) => {
      this.id = +params.id;
      this.editMode = params.id != null;
      this.initForm();
    });
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    // if (this.editMode) {
    //   const recipe = this._recipeService.getRecipe(this.id);
    //   recipeName = recipe.name;
    //   recipeImagePath = recipe.imagePath;
    //   recipeDescription = recipe.description;
    //   if (recipe.ingredients) {
    //     for (let ingredient of recipe.ingredients) {
    //       recipeIngredients.push(
    //         new FormGroup({
    //           name: new FormControl(ingredient.name, Validators.required),
    //           amount: new FormControl(ingredient.amount, [
    //             Validators.required,
    //             Validators.pattern(/^[1-9]+[0-9]*$/),
    //           ]),
    //         })
    //       );
    //     }
    //   }
    // }

    if (this.editMode) {
      this._store
        .select('recipes')
        .pipe(
          map((recipeState) => {
            return recipeState.recipes.find((recipe, index) => {
              return index === this.id;
            });
          })
        )
        .subscribe((recipe) => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;
          if (recipe.ingredients) {
            for (let ingredient of recipe.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/),
                  ]),
                })
              );
            }
          }
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeForm.value.name,
    //   this.recipeForm.value.imagePath,
    //   this.recipeForm.value.description,
    //   this.recipeForm.value.ingredients
    // );
    if (this.editMode) {
      this._recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this._recipeService.addRecipe(this.recipeForm.value);
    }

    this.onCancel(); // redirect the user to /recipes
  }

  getControls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onCancel(): void {
    this._router.navigate(['/recipes'], { relativeTo: this._route });
  }

  onDeleteIngredient(index: number): void {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
