
export interface SellerStatistiqueInterface {
    status: boolean;
    message: string;
    data: {
        seller_id: number;
        total_sales: {
            total_amount: number;
            total_units_sold: number;
        };
        sales_by_product: Array<{
            name: string;
            quantity: number;
            total: number;
        }>;
    };
}
