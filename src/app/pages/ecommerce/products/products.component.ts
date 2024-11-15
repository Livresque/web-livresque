import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Product, ProductsCategoriesModels} from "../../../core/models/products.models";
import {UserProductsDataService} from "../../../core/services/user-products-data.service";
import {CrudService} from "../../../core/services/crud.service";
import {environment} from "../../../../environments/environment.prod";
import {take} from "rxjs";
import {TokenStorageService} from "../../../core/services/token-storage.service";
import {ReusableFunctionService} from "../../../core/services/reusable-function.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

/**
 * Ecommerce products component
 */

export class ProductsComponent implements OnInit {

  breadCrumbItems: Array<{}>;

  protected readonly environment = environment;

  // log = '';
  // discountRates: number[] = [];
  // public products: productModel[] = [];
  // public productTemp: productModel[] = [];

  //Filter discount or not
  selectedFilterActifOrNot:string = ""
  itemsSelectedFilterActifOrNot = [
    { value: "Disponible", label: 'En promotion' },
    { value: "Non disponible", label: 'Pas de promotion' },
  ];


  //current user categories and Product
  currentUserCategories: { id: number, property1: string }[] = []
  currentUserProduct: Product[] = []
  initialProducts: Product[] = []

  //
  //Modal
  // Create new Categorie
  modalRef?: BsModalRef;
  submitted: boolean = false;
  formDataCategorie!: UntypedFormGroup;
  categorieExist:boolean = false
  categoryId!: number
  categoryName!: string

  constructor(
      private http: HttpClient,
      private userProductsDataService: UserProductsDataService,
      private crudService: CrudService,
      public formBuilder: UntypedFormBuilder,
      private tokenStorage: TokenStorageService,
      public reusableFunction: ReusableFunctionService,
      private modalService: BsModalService,

      private reusFunction: ReusableFunctionService,
      public toastr:ToastrService,
  ) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Products', active: true }];
    // this.products = Object.assign([], productList);

    this.formDataCategorie = this.formBuilder.group({
      user: [null],
      name: []
    })

    this.getCurrentUserCategorie();
    this.getCurrentUserProduct()
  }

  //Recuperer la categorie
  getCurrentUserCategorie(){
    // Récupérer les catégories de l'utilisateur lors de l'initialisation
    this.userProductsDataService.fetchCurrentUserCategories();

    // S'abonner aux catégories pour afficher les données dans le composant
    this.userProductsDataService.getCategoryList().subscribe(categories => {
      this.currentUserCategories = categories;
    });
  }

  // Recuperer tout les produits lier a l'utilisateur en cour
  getCurrentUserProduct(){
    // Souscrire aux produits affichés
    this.userProductsDataService.displayedProducts.subscribe((products) => {
      console.log(products)
      this.currentUserProduct = products;
      this.initialProducts = products
    });

    // Charger les produits initiaux
    this.userProductsDataService.getCurrentUserProduct();
  }


  // Méthode pour charger plus de produits
  onLoadMore() {
    this.userProductsDataService.loadMoreProducts();
  }






  searchFilter(e: any) {
    const searchStr = e.target.value;

    // Si la chaîne de recherche est vide, réinitialisez currentUserProduct à initialProducts
    if (searchStr.trim() === '') {
      this.currentUserProduct = [...this.initialProducts]; // Réinitialiser à la valeur initiale
      return; // Sortir de la fonction
    }

    // Filtrer les produits basés sur la chaîne de recherche
    this.currentUserProduct = this.initialProducts.filter((product) => {
      return product.name.toLowerCase().includes(searchStr.toLowerCase());
    });
  }

  // discountLessFilter(e, percentage) {
  //   if (e.target.checked && this.discountRates.length === 0) {
  //     this.products = productList.filter((product) => {
  //       return product.discount < percentage;
  //     });
  //   }
  //   else {
  //     this.products = productList.filter((product) => {
  //       return product.discount >= Math.max.apply(null, this);
  //     }, this.discountRates);
  //   }
  // }
  //
  // discountMoreFilter(e, percentage: number) {
  //   if (e.target.checked) {
  //     this.discountRates.push(percentage);
  //   } else {
  //     this.discountRates.splice(this.discountRates.indexOf(percentage), 1);
  //   }
  //   this.products = productList.filter((product) => {
  //     return product.discount >= Math.max.apply(null, this);
  //   }, this.discountRates);
  // }



  openModal(content: any, categoryId: number, categoryName: string) {
    this.submitted = false;
    this.categoryId = categoryId ;
    // this.categoryName = categoryName ;
    this.formDataCategorie.patchValue({
      name: categoryName
    })
    this.modalRef = this.modalService.show(content);
  }

  validSubmitcategoryForm() {
    this.submitted = true;

    // Arrêter si le formulaire n'est pas valide
    if (this.formDataCategorie.invalid ) {
      return;
    }
    if (this.categorieExist ) {
      this.toastr.warning("Cette catégorie existe déja! Veuillez creer une nouvelle !")
      return;
    }

    this.formDataCategorie.patchValue({
      user: this.tokenStorage.getUser().data.user_id,
      name: this.reusFunction.NormaliseToLowerCase(this.formDataCategorie.get('name').value).trim()

    })

    const categoryData = this.formDataCategorie.value;

    console.log('Catégorie mise a jour : ', categoryData);

    this.crudService.updateData(environment.api_url+`category/${this.categoryId}/update/`, this.formDataCategorie.value)
        .pipe(take(1))
        .subscribe((data: any)=>{
          this.toastr.success(`La catégorie ${this.formDataCategorie.get('name').value} est a été mise a jour avec succè !`)
          setTimeout(()=>{
            this.getCurrentUserCategorie();
          }, 1500)
          //Recuperer et rafraichir les categories de l'utilsateur courant
          this.getCurrentUserCategorie();
        }, error => {
          this.toastr.error("Une erreur est survenu lors de la mise a jour de la catégorie veuillez contacter le support. Merci !")
        })

    // Fermer la modal après sauvegarde
    this.modalRef?.hide();
  }

  // Vérifier si la catégorie existe déjà
  verifyIfCategoryExists(event: Event) {
    const input = (event.target as HTMLInputElement).value.toLowerCase().trim();
    console.log('Vérification si la catégorie existe : ', input);

    // Utiliser `.some` pour vérifier si un nom de catégorie correspond à l'input
    const categoryExists = this.currentUserCategories.some(category =>
        category.property1.toLowerCase() === input
    );

    if (categoryExists) {
      this.toastr.warning("Cette catégorie existe déjà !");
      this.categorieExist = true;
    } else {
      this.categorieExist = false;
    }
  }




}
