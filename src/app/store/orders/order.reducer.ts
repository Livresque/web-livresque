import { Action, createReducer, on } from '@ngrx/store';
import {
    fetchEcoorderDataData,
    fetchEcoorderDataSuccess,
    fetchEcoorderDataFail,
    addEcoOrdersSuccess,
    deleteEcoOrdersSuccess,
    updateEcoOrdersSuccess, fetchEcoDetailIdDataSuccess, fetchEcoDetailIdData,
} from './order.actions';


export interface EcoOrderState {
    orderDatas: any[];
    orderIdDetail: any;
    orderDetailData: any;

    loading: boolean;
    error: any; 
}

export const initialState: EcoOrderState = {
    orderDatas: [],
    orderIdDetail: null,
    orderDetailData: null,
    loading: false,
    error: null,
};

export const OrderReducer = createReducer(
    initialState,
    on(fetchEcoorderDataData, (state) => {
        return {...state, loading: true, error: null};
    }),
    on(fetchEcoorderDataSuccess, (state, { orderDatas }) => {
        return { ...state, orderDatas, loading: false };
    }),
    on(fetchEcoorderDataFail, (state, { error }) => {
        return { ...state, error, loading: false };
    }),
    on(addEcoOrdersSuccess, (state, { newData }) => {
        return { ...state, orderDatas: [newData, ...state.orderDatas], error: null };
    }),

    //Get details Data
    on(fetchEcoDetailIdData, (state, { orderIdDetail }) => {
        return { ...state, orderIdDetail, loading: true }; // Assumes orderDatas is an object; if it's different, adjust as needed
    }),

    on(fetchEcoDetailIdDataSuccess, (state, {orderDetailData}) => {
        return {...state,orderDetailData:orderDetailData,  loading: false}
    }),

    on(updateEcoOrdersSuccess, (state, { updatedData }) => ({
        ...state,
        orderDatas: state.orderDatas.map((orderDatas) => orderDatas.id === updatedData.id ? updatedData : orderDatas), error: null

    })),
    on(deleteEcoOrdersSuccess, (state, { ids }) => {
        const updatedTable = state.orderDatas.filter(
            (orderDatas) => !ids.includes(orderDatas.id)
        );
        return { ...state, orderDatas: updatedTable, error: null };
    })
);

// Selector
export function reducer(state: EcoOrderState | undefined, action: Action) {
    return OrderReducer(state, action);
}
