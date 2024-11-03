import { Action, createReducer, on } from '@ngrx/store';
import {
    addDeliverylistFailure,
    addDeliverylistSuccess,
    fetchDeliveryData,
    fetchDeliveryFail,
    fetchDeliverySuccess,
    updateDeliverylistSuccess
} from './delivery.action';


export interface deliveryState {
    delivery: any[];
    loading: boolean;
    error: any;
}

export const initialState: deliveryState = {
    delivery: [],
    loading: false,
    error: null,
};

export const DeliveryReducer = createReducer(
    initialState,
    on(fetchDeliveryData, (state) => {
        return { ...state, loading: true, error: null };
    }),
    on(fetchDeliverySuccess, (state, { delivery }) => {
        return { ...state, delivery, loading: false };
    }),
    on(fetchDeliveryFail, (state, { error }) => {
        return { ...state, error, loading: false };
    }),

    on(addDeliverylistSuccess, (state, { newData }) => {
        return { ...state, delivery: [newData, ...state.delivery] };
    }),

    on(addDeliverylistFailure, (state, { error }) => {
        return { ...state,  error: error };
    }),


    on(updateDeliverylistSuccess, (state, { updatedData }) => {
        return {
            ...state
        };

    }),
);
// delivery: state.delivery.map((delivery) => delivery.id === updatedData.id ? updatedData : delivery), error: null

// Selector
export function reducer(state: deliveryState | undefined, action: Action) {
    return DeliveryReducer(state, action);
}
