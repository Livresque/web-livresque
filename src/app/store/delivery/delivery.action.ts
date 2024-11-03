import { createAction, props } from '@ngrx/store';
import { DeliveryModel } from './delivery.model';

// fetch 
export const fetchDeliveryData = createAction(
    '[Data] fetch Customer'
);
export const fetchDeliverySuccess = createAction(
    '[Data] fetch Customer success',
    props<{ delivery: DeliveryModel[] }>()
)
export const fetchDeliveryFail = createAction(
    '[Data fetch Customer failed]',
    props<{ error: any }>()
)

// Add Data
export const addDeliverylist = createAction(
    '[Data] Add Customerlist',
    props<{ newData: DeliveryModel }>()
);
export const addDeliverylistSuccess = createAction(
    '[Data] Add Customerlist Success',
    props<{ newData: DeliveryModel }>()
);
export const addDeliverylistFailure = createAction(
    '[Data] Add Customerlist Failure',
    props<{ error: any }>()
);


// Update Data
export const updateDeliverylist = createAction(
    '[Data] Update Customerlist',
    props<{ updatedData: DeliveryModel }>()
);
export const updateDeliverylistSuccess = createAction(
    '[Data] Update Customerlist Success',
    props<{ updatedData: DeliveryModel }>()
);
export const updateDeliverylistFailure = createAction(
    '[Data] Update Customerlist Failure',
    props<{ error: string }>()
);

// Delete Data
export const deleteCustomerlist = createAction(
    '[Data] Delete Customerlist',
    props<{ id: string }>()
);
export const deleteCustomerlistSuccess = createAction(
    '[Data] Delete Customerlist Success',
    props<{ id: string }>()
);
export const deleteCustomerlistFailure = createAction(
    '[Data] Delete Customerlist Failure',
    props<{ error: string }>()
);