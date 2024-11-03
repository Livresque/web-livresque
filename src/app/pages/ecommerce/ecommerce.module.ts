import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// module
import { EcommerceRoutingModule } from './ecommerce-routing.module';
import { UIModule } from '../../shared/ui/ui.module';
import { WidgetModule } from '../../shared/widget/widget.module';

// bootstrap module
import { NgxSliderModule } from 'ngx-slider-v2';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';
// component
import { ProductsComponent } from './products/products.component';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { AddproductComponent } from './addproduct/addproduct.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { OrdersComponent } from './orders/orders.component';
import {ListShopComponent} from "./list-shop/list-shop.component";

// dropzone
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import {TagInputModule} from "ngx-chips";
import {NgxEditorModule} from "ngx-editor";

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'w',
    autoProcessQueue: false,
  maxFilesize: 50,
  acceptedFiles: 'image/png, image/webp, image/jpeg'

};

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [
      ProductsComponent,
      ProductdetailComponent,
      AddproductComponent,
      DeliveryComponent,
      OrdersComponent,
      ListShopComponent

  ],
    imports: [
        CommonModule,
        EcommerceRoutingModule,
        TabsModule.forRoot(),
        ModalModule.forRoot(),
        FormsModule,
        SlickCarouselModule,
        BsDropdownModule.forRoot(),
        ReactiveFormsModule,
        UIModule,
        WidgetModule,
        NgxSliderModule,
        NgSelectModule,
        PaginationModule.forRoot(),
        BsDatepickerModule.forRoot(),
        DropzoneModule,
        TagInputModule,
        NgxEditorModule.forRoot({
            locals: {
                // menu
                bold: 'Bold',
                italic: 'Italic',
                code: 'Code',
                blockquote: 'Blockquote',
                underline: 'Underline',
                strike: 'Strike',
                bullet_list: 'Bullet List',
                ordered_list: 'Ordered List',
                heading: 'Heading',
                h1: 'Header 1',
                h2: 'Header 2',
                h3: 'Header 3',
                h4: 'Header 4',
                h5: 'Header 5',
                h6: 'Header 6',
                align_left: 'Left Align',
                align_center: 'Center Align',
                align_right: 'Right Align',
                align_justify: 'Justify',
                text_color: 'Text Color',
                background_color: 'Background Color',

                // popups, forms, others...
                url: 'URL',
                text: 'Text',
                openInNewTab: 'Open in new tab',
                insert: 'Insert',
                altText: 'Alt Text',
                title: 'Title',
                remove: 'Remove',
                enterValidUrl: 'Please enter a valid URL',
            },
        }),
    ],
  providers: [
    DatePipe,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],

})
export class EcommerceModule { }
