// export interface OrdersModel {
//     id?: any;
//     name?: string;
//     total?: string;
//     status?: string;
//     payment_icon?: string;
//     index?: any;
//
//     date?: string;
//     payment?: any;
// }

import {DeliveryModel} from "../delivery/delivery.model";

export interface OrdersModel {
    index: any;
    id: string;
    billing: Billing;
    shipping: Shipping;
    items: OrderItem[];
    livreur: DeliveryModel[];
    order_id: string;
    total: string;
    is_locked:boolean;
    currency: string;
    payment_method: string;
    payment_status: string;
    payment_icon: string;
    store_name: string;
    store_url: string;
    store_country: string;
    created_at: string;
    order_status:string
  }
  
  export interface Billing {
    id: number;
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  }
  
  export interface Shipping {
      id: number;
      first_name: string;
      last_name: string;
      address_1: string;
      city: string;
      postcode: string;
      country: string;
      email: string;
      phone: string;
  }
  
  export interface OrderItem {
    id: number;
    product_name: string;
    product_image:string
    quantity: string;
    price: string;
    order: number;

  }
  

///////////////////////////////////

// export interface OrdersModel {
//     id:string,
//     order_id: string;
//     status: string;
//     total: string;
//     currency: string;
//     payment_method: string;
//     payment_icon?: string;
//     billing: Billing;
//     shipping: Shipping;
//     items: Item[];
//     created_at: string
// }

// export interface Billing {
//     first_name: string;
//     last_name: string;
//     address_1: string;
//     city: string;
//     postcode: string;
//     country: string;
//     email: string;
//     phone: string;
// }

// export interface Shipping {
//     first_name: string;
//     last_name: string;
//     address_1: string;
//     city: string;
//     postcode: string;
//     country: string;
// }

// export interface Item {
//     product_name: string;
//     quantity: number;
//     price: string;
// }
