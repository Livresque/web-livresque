import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, mergeMap, map, tap} from 'rxjs/operators';
import {
    addDeliverylist,
    addDeliverylistFailure,
    addDeliverylistSuccess,
    fetchDeliveryData,
    fetchDeliveryFail,
    fetchDeliverySuccess,
    updateDeliverylist,
    updateDeliverylistFailure,
    updateDeliverylistSuccess } from './delivery.action';
import { of } from 'rxjs';
import { CrudService } from 'src/app/core/services/crud.service';
import {ToastrService} from "ngx-toastr";
import {environment} from "../../../environments/environment.prod";

@Injectable()
export class DeliveryEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchDeliveryData),
            mergeMap(() =>
                this.CrudService.fetchData(environment.api_url+'list-delivery/').pipe(
                    map((deliveryData) => fetchDeliverySuccess({ delivery:deliveryData })),
                    catchError((error) =>
                        of(fetchDeliveryFail({ error }))
                    )
                )
            ),
        ),
    )

    addData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addDeliverylist),
            mergeMap(({ newData }) =>
                this.CrudService.addData(environment.api_url+'add-delivery/', newData).pipe(
                    map(() => addDeliverylistSuccess({ newData })),
                    catchError((error:any) => {
                        // console.log("Erreur API capturée :");
                        // console.log(error);
                        return of(addDeliverylistFailure({ error: error }));
                    })
                )
            )
        )
    );

    // Je patch ici je ne put pas
    updateData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(updateDeliverylist),
            mergeMap(({ updatedData }) =>
                this.CrudService.patchData(environment.api_url+`update-delivery-datas/${updatedData.id}/`, updatedData).pipe(
                    map(() => updateDeliverylistSuccess({ updatedData })),
                    tap(()=>{this.toastService.success("Mise a jour effectuer avec succes !")}),
                    catchError((error) => {
                        this.toastService.error("Une erreur s'est produite lors de la mise a jour. Merci de contacter l'administrateur systeme");

                        return of(updateDeliverylistFailure({ error }))
                    })
                )
            )
        )
    );

    constructor(
        private actions$: Actions,
        private CrudService: CrudService,
        public toastService: ToastrService,
    ) { }

}