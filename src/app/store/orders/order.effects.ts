import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, mergeMap, map, switchMap} from 'rxjs/operators';
import {
    fetchEcoorderDataData,
    fetchEcoorderDataSuccess,
    fetchEcoorderDataFail,
    addEcoOrders,
    addEcoOrdersSuccess,
    addEcoOrdersFailure,
    deleteEcoOrders,
    deleteEcoOrdersFailure,
    deleteEcoOrdersSuccess,
    updateEcoOrdersSuccess,
    updateEcoOrders,
    updateEcoOrdersFailure,
    fetchEcoDetailIdDataSuccess,
    fetchEcoDetailIdData
} from './order.actions';
import {of, take} from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {environment} from "../../../environments/environment.prod";
import {OrdersModel} from "./order.model";
import {TokenStorageService} from "../../core/services/token-storage.service";
import {HttpHeaders} from "@angular/common/http";


@Injectable()
export class OrderEffects {
    currentUserId!: number
    userConnectedHeader!: HttpHeaders
    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        private tokenStorage: TokenStorageService,

    ) {
        this.currentUserId = this.tokenStorage.getUser().data.user_id
        this.userConnectedHeader = new HttpHeaders({
            'Authorization': `Token ${this.tokenStorage.getRefreshToken()}`
        })
    }


    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchEcoorderDataData),
            switchMap(() =>
                this.CrudService.fetchDataWithLocalStorageTokenHeader(
                    environment.api_url + 'orders//seller/'+this.currentUserId+'/', this.userConnectedHeader)
                    .pipe(
                    take(1),
                    map((orderDatas: OrdersModel[]) => fetchEcoorderDataSuccess({ orderDatas })),
                    catchError(error => of(fetchEcoorderDataFail({ error })))
                )
            )
        )
    );

    retrieveData$ = createEffect(() =>
       this.actions$.pipe(
           ofType(fetchEcoDetailIdData),
           switchMap(({orderIdDetail})=>
               this.CrudService.fetchData(environment.api_url+`order-retrieve/${orderIdDetail}`).pipe(
                   map((orderDetailData)=>fetchEcoDetailIdDataSuccess({ orderDetailData })),
                   catchError((error)=>of(fetchEcoorderDataFail({ error })))
               )
           )
       )
    )

    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addEcoOrders),
            mergeMap(({ newData }) =>
                this.CrudService.addData('/app/orderData', newData).pipe(
                    map(() => addEcoOrdersSuccess({ newData })),
                    catchError((error) => of(addEcoOrdersFailure({ error })))
                )
            )
        )
    );
    updateData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateEcoOrders),
            mergeMap(({ updatedData }) =>
                this.CrudService.updateData('/app/orderData', updatedData).pipe(
                    map(() => updateEcoOrdersSuccess({ updatedData })),
                    catchError((error) => of(updateEcoOrdersFailure({ error })))
                )
            )
        )
    );


    deleteData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteEcoOrders),
            mergeMap(({ ids }) =>
                this.CrudService.deleteData('/app/orderData').pipe(
                    map(() => deleteEcoOrdersSuccess({ ids })),
                    catchError((error) => of(deleteEcoOrdersFailure({ error })))
                )
            )
        )
    );



}