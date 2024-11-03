// export interface CustomersModel {
//     id: number;
//     username: string;
//     phone: string;
//     email: string;
//     address: string;
//     rating: string;
//     balance: string;
//     date: string;
// }


export interface DeliveryModel {
    id: string;
    surname: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    rating: number;
    lock: boolean;
    address: string;
    delivery_image: string;
    vehicle: string;
    license_plat: string;
    created_at: Date;
    is_available: string;
}
