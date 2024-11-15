import { ActionReducerMap } from "@ngrx/store";
import { EcoOrderState, OrderReducer } from "./orders/order.reducer";
import { AuthenticationState, authenticationReducer } from "./Authentication/authentication.reducer";
import { CartReducer, CartState } from "./Cart/cart.reducer";

import { LayoutState, layoutReducer } from "./layouts/layouts.reducer";



export interface RootReducerState {
    layout: LayoutState;
    auth: AuthenticationState;
    EcoOrderList: EcoOrderState;
    CartList: CartState;

}

export const rootReducer: ActionReducerMap<RootReducerState> = {
    layout: layoutReducer,
    auth: authenticationReducer,
    EcoOrderList: OrderReducer,
    CartList: CartReducer,

}