import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { RecipesComponent } from './recipes.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeHomeComponent } from './recipe-home/recipe-home.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipesRoutingModule } from './recipes-routing.module';

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    RecipeHomeComponent,
    RecipeEditComponent,
  ],
  imports: [ReactiveFormsModule, RecipesRoutingModule, SharedModule],
})
export class RecipesModule {}
