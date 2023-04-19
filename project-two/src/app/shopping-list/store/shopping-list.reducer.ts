import { Ingredient } from '../models/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editIngredient: Ingredient;
  editedIngredientIndex: number;
}

export interface AppState {
  shoppingList: State;
}

const initialState: State = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editIngredient: null,
  editedIngredientIndex: -1,
};

export function shoppingListReducer(
  state: State = initialState,
  action: ShoppingListActions.ShoppingListActions
) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload],
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };

    case ShoppingListActions.UPDATE_INGREDIENT:
      //immutable logic
      const ingredient = state.ingredients[action.payload.index];
      const updateIngredient = { ...ingredient, ...action.payload.ingredient };
      const updateIngredients = [...state.ingredients];
      updateIngredients[action.payload.index] = updateIngredient;

      return { ...state, ingredients: updateIngredients };

    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ig, igIndex) => {
          return igIndex !== action.payload;
        }),
      };

    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editIngredientIndex: action.payload,
        editIngredient: { ...state.ingredients[action.payload] },
      };

    case ShoppingListActions.STOP_EDIT:
      return { ...state, editIngredient: null, editIngredientIndex: -1 };

    default:
      return state;
  }
}
