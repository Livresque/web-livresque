export interface Product {
    id: number
    name: string;
    regular_price: number;
    sale_price: number;
    description: string;
    short_description: string;
    categories: any[];
    productsDetailsCategories: ProductsDetailsCategories[];
    front_cover: string;
    back_cover: string;
    downloads: string[];
    isbn: string;
    author_name: string;
    summary: string;
    page_num: number;
    genre: string;
    age: number;
    published_year: number;
}


export interface ProductVariantImage {
    id: number;
    variant_image: string;  // URL de l'image variante
}


export interface User {
    id: number;
    username: string;
}

export class ProductsCategoriesModels{
    id: number
    property1: string
}
export class ProductsDetailsCategories{
    id: number
    name: string
}
export class ProjetCategoriesModels{

    id: number;
    name: string;
    slug: string;
    parent: number;
    description: string;
    display: string;
    image: string;
    menu_order: number;
    count: number;
    _links: {
        self: [
            {
                href: string
            }
        ];
        collection: [
            {
                href: string
            }
        ]
    }


}

// export interface Category {
//     id: number;
//     name: string;
// }
