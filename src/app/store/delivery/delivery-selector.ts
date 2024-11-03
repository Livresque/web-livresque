import { createFeatureSelector, createSelector } from '@ngrx/store';
import { deliveryState } from './delivery.reducer';

export const selectDataState = createFeatureSelector<deliveryState>(
    'Delivery'
);

export const selectDataDelivery = createSelector(
    selectDataState,
    (state: deliveryState) => state.delivery
);

export const selectDataLoading = createSelector(
    selectDataState,
    (state: deliveryState) => state.loading
);

export const selectDataError = createSelector(
    selectDataState,
    (state: deliveryState) => state.error
);

