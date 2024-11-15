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


export interface OrdersModel {
    id: number;
    parent_id: number;
    status: string;
    currency: string;
    version: string;
    prices_include_tax: boolean;
    date_created: string;
    date_modified: string;
    discount_total: string;
    discount_tax: string;
    shipping_total: string;
    shipping_tax: string;
    cart_tax: string;
    total: string;
    total_tax: string;
    customer_id: number;
    order_key: string;
    billing: Address;
    shipping: Address;
    payment_method: string;
    payment_method_title: string;
    transaction_id: string;
    customer_ip_address: string;
    customer_user_agent: string;
    created_via: string;
    customer_note: string;
    date_completed: string | null;
    date_paid: string | null;
    cart_hash: string;
    number: string;
    meta_data: any[];
    line_items: LineItem[];
    tax_lines: any[];
    shipping_lines: any[];
    fee_lines: any[];
    coupon_lines: any[];
    refunds: any[];
    payment_url: string;
    is_editable: boolean;
    needs_payment: boolean;
    needs_processing: boolean;
    date_created_gmt: string;
    date_modified_gmt: string;
    date_completed_gmt: string | null;
    date_paid_gmt: string | null;
    currency_symbol: string;
    _links: Links;
}

export interface Address {
    firstname: string;
    lastname: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
}

export interface LineItem {
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: string;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    taxes: any[];
    meta_data: any[];
    sku: string | null;
    price: number;
    image: Image;
    parent_name: string | null;
}

export interface Image {
    id: number;
    src: string;
}

export interface Links {
    self: Link[];
    collection: Link[];
    customer: Link[];
}

export interface Link {
    href: string;
}

// import {DeliveryModel} from "../delivery/delivery.model";
//
// export interface OrdersModel {
//     index: any;
//     id: string;
//     billing: Billing;
//     shipping: Shipping;
//     items: OrderItem[];
//     livreur: DeliveryModel[];
//     order_id: string;
//     total: string;
//     is_locked:boolean;
//     currency: string;
//     payment_method: string;
//     payment_status: string;
//     payment_icon: string;
//     store_name: string;
//     store_url: string;
//     store_country: string;
//     created_at: string;
//     order_status:string
//   }
//
//   export interface Billing {
//     id: number;
//     firstname: string;
//     lastname: string;
//     address_1: string;
//     city: string;
//     postcode: string;
//     country: string;
//     email: string;
//     phone: string;
//   }
//
//   export interface Shipping {
//       id: number;
//       firstname: string;
//       lastname: string;
//       address_1: string;
//       city: string;
//       postcode: string;
//       country: string;
//       email: string;
//       phone: string;
//   }
//
//   export interface OrderItem {
//     id: number;
//     product_name: string;
//     product_image:string
//     quantity: string;
//     price: string;
//     order: number;
//
//   }
//
