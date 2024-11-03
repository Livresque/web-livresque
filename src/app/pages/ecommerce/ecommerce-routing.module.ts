import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './products/products.component';
import { ProductdetailComponent } from './productdetail/productdetail.component';

import { AddproductComponent } from './addproduct/addproduct.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { OrdersComponent } from './orders/orders.component';
import {ListShopComponent} from "./list-shop/list-shop.component";

const routes: Routes = [
    {
        path: 'products',
        component: ProductsComponent
    },
    {
        path: 'product-detail/:id',
        component: ProductdetailComponent
    },
    {
        path: 'add-product',
        component: AddproductComponent
    },
    {
        path: 'customers',
        component: DeliveryComponent
    },
    {
        path: 'orders',
        component: OrdersComponent
    } ,
    {
        path: 'list-shop',
        component: ListShopComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EcommerceRoutingModule { }
