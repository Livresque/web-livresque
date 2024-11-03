export interface Product {
    id: number;
    name: string;
    manufacture_name?: string;  // Le "?" signifie que ce champ est optionnel
    manufacture_brand?: string;
    price: number;
    promotional_price?: number;
    main_image: string;  // URL de l'image principale
    category: number;  // Référence à une autre interface `Category` pour la catégorie du produit
    features: string;  // Caractéristiques supplémentaires du produit
    quantity?: number;
    weight?: string;
    size?: string;
    dimensions?: string;
    product_state?: string;
    productOptions: string;
    product_note:number;
    stock_state?: string;
    user: User;  // Référence à une autre interface `User` pour l'utilisateur associé
    variant_images: ProductVariantImage[];  // Liste des images de variantes
    ratings?: number;  // Note du produit
    oriRate?: number;  // Taux original (avant réduction)
    discount?: number;  // Pourcentage de réduction
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

// export interface Category {
//     id: number;
//     name: string;
// }
