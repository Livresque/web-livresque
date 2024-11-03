import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaasComponent } from './saas/saas.component';

const routes: Routes = [

    {
        path: '',
        component: SaasComponent
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardsRoutingModule {}
