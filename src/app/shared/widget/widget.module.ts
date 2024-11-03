import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';

import { StatComponent } from './stat/stat.component';
import { TransactionComponent } from './transaction/transaction.component';
import {TimerPipePipe} from "../../core/pipes/timer-pipe.pipe";

@NgModule({
  declarations: [StatComponent, TransactionComponent],
    imports: [
        CommonModule,
        ModalModule.forRoot(),
        TimerPipePipe
    ],
  exports: [StatComponent, TransactionComponent]
})
export class WidgetModule { }
