import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, take} from "rxjs";
import {CrudService} from "./crud.service";
import {TokenStorageService} from "./token-storage.service";
import {environment} from "../../../environments/environment.prod";
import {Product, ProductsCategoriesModels} from "../models/products.models";
import {map} from "rxjs/operators";
import {ReusableFunctionService} from "./reusable-function.service";

@Injectable({
  providedIn: 'root'
})
export class UserProductsDataService {


  private userCategoriesSubject = new BehaviorSubject<ProductsCategoriesModels[]>([]);
  public userCategories$: Observable<ProductsCategoriesModels[]> = this.userCategoriesSubject.asObservable();


  //Liste procduct and pagination
    private allProducts: Product[] = [];  // Tous les produits récupérés
    public displayedProducts: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);  // Produits affichés

    private initialLoad = 9;  // Nombre d'éléments à charger initialement
    private loadStep = 6;      // Nombre d'éléments à charger à chaque clic de "Load More"
    private currentIndex = 0;  // Index actuel de la pagination

  constructor(
      private crudService: CrudService,
      private tokenStorage: TokenStorageService,
      public reusableFunction: ReusableFunctionService
  ) { }

  // Récupérer les catégories de l'utilisateur connecté
  fetchCurrentUserCategories(): void {

    this.crudService.fetchData(`${environment.api_url}products/categories/`)
        .pipe(take(1))
        .subscribe((data: ProductsCategoriesModels[]) => {
          console.log("Liste des catégories :", data);

          this.userCategoriesSubject.next(data);
        });
  }

  // Obtenir les catégories sous forme de tableau d'objets { id, name }
  getCategoryList(): Observable<{ id: number, property1: string }[]> {
    return this.userCategories$.pipe(
        map(categories => categories.map(c => ({
          id: c.id,
            property1: c.property1
        })))
    );
  }

  //
    // Récupère les produits liés à l'utilisateur
    getCurrentUserProduct() {
        this.crudService.fetchData(`${environment.api_url}products/user/${this.tokenStorage.getUser().username}`)
            .subscribe((data: Product[]) => {
                this.allProducts = data;
                this.currentIndex = 0;  // Réinitialiser l'index
                this.loadInitialProducts();
            });
    }

    // Charger les 10 premiers produits
    loadInitialProducts() {
        const initialProducts = this.allProducts.slice(0, this.initialLoad);
        this.displayedProducts.next(initialProducts);
        this.currentIndex = this.initialLoad;
    }

    // Charger plus de produits (par 5)
    loadMoreProducts() {
        const nextIndex = this.currentIndex + this.loadStep;
        const moreProducts = this.allProducts.slice(this.currentIndex, nextIndex);
        const currentDisplayed = this.displayedProducts.value;
        this.displayedProducts.next([...currentDisplayed, ...moreProducts]);
        this.currentIndex = nextIndex;
    }


}
