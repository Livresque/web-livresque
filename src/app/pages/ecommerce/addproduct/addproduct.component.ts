import {Component, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {DropzoneConfigInterface} from "ngx-dropzone-wrapper";
import {TokenStorageService} from "../../../core/services/token-storage.service";
import {ReusableFunctionService} from "../../../core/services/reusable-function.service";
import {CrudService} from "../../../core/services/crud.service";
import {environment} from "../../../../environments/environment.prod";
import {Subscription, take} from "rxjs";
import {any} from "@amcharts/amcharts5/.internal/core/util/Array";
import {ToastrService} from "ngx-toastr";
import {Product} from "../../../core/models/products.models";
import {UserProductsDataService} from "../../../core/services/user-products-data.service";
import {Editor, Toolbar} from "ngx-editor";

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss']
})


export class AddproductComponent implements OnInit, OnDestroy {
  productForm: UntypedFormGroup;
  breadCrumbItems: Array<{}>;
  submit: boolean = false;
  front_cover: File[] = [];
  back_cover: File[] = [];
  mainImagePreview: string | null = null; // Pour stocker l'aperçu de l'image principale
  variantImagePreviews: string | null = null; // Pour stocker les aperçus des images variantes

  // Categories for the ng-select
  currentUserCategories: {id: number, property1: string}[] = [];
  currentUserGenre: {id: number, property1: string}[] = [
    { id: 1, property1: "Action" },
    { id: 2, property1: "Aventure" },
    { id: 3, property1: "Comédie" },
    { id: 4, property1: "Drame" }
  ];

  // Dropzone configurations
  mainImageDropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    uploadMultiple: false,
    previewsContainer: false,
    parallelUploads: 1,
    maxFiles: 1,
    init: function() {
      this.on("addedfile", function(file) {
      });

      this.on("complete", function(file) {
      });
    }
  };

  variantImagesDropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    uploadMultiple: false,
    previewsContainer: false,
    autoProcessQueue: false, // Ne traite pas les fichiers automatiquement
    init: function() {
      this.on("addedfile", function(file) {
      });

      this.on("complete", function(file) {
      });
    }
  };

  // Create new Categorie
  modalRef?: BsModalRef;
  submitted: boolean = false;
  formDataCategorie!: UntypedFormGroup;
  categorieExist:boolean = false

  //Current User Id
  currentUserId!: number

  //Texte Editor
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    // [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    // ['link'],
    // ['link', 'image'],
    // ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  //Observable Group
  subscriptions: Subscription[] = []

  //File pdf
  downloadsFile: File | null = null;

  userConnectedHeader!: HttpHeaders

  constructor(
      public formBuilder: UntypedFormBuilder,
      private http: HttpClient,
      private modalService: BsModalService,
      private tokenStorage: TokenStorageService,
      private reusFunction: ReusableFunctionService,
      private crudService: CrudService,
      public toastr:ToastrService,
      private userProductsDataService: UserProductsDataService
  ) {}

  get form() {
    return this.productForm.controls;
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Add Product', active: true }];

    // Initializing form controls
    this.productForm = this.formBuilder.group({
      name: ['Livres name', [Validators.required]],
      regular_price: [1200, Validators.min(0)],
      sale_price: [1000, Validators.min(0)],
      isbn: ['isbn_2010'],
      page_num: [34, Validators.min(1)],
      published_year: [2021, Validators.min(4)],
      author_name: ['Livresque'],
      summary: ['summary'],
      genre: [null],
      age: [16, Validators.min(16)],
      categories: [[]],
      downloads: [null]
    });

    this.getCategorie()

     this.currentUserId = this.tokenStorage.getUser().data.user_id

     //Texte edditor
    this.editor = new Editor();

    this.userConnectedHeader = new HttpHeaders({
      'Authorization': `Token ${this.tokenStorage.getRefreshToken()}`
    })
  }

  //Recuperer la categorie
  getCategorie(){
    // Récupérer les catégories de l'utilisateur lors de l'initialisation
    this.userProductsDataService.fetchCurrentUserCategories();

    // S'abonner aux catégories pour afficher les données dans le composant
    this.userProductsDataService.getCategoryList().subscribe(categories => {
      this.currentUserCategories = categories;
    });
  }

  onFilePdfChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.downloadsFile = file; // Stocke le fichier sélectionné
    }
  }


  async validSubmit()  {
    this.submit = true;

    if (this.productForm.invalid) {
      this.toastr.error("Formulaire invalide. Certains champs sont requis !");
      this.productForm.markAllAsTouched();
      Object.keys(this.productForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.productForm.get(key)?.errors;
        this.productForm.controls[key].markAsTouched();
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            const errorMessage = this.reusFunction.getErrorMessage(key, controlErrors);
            this.toastr.error(errorMessage, 'Erreur:');
          });
        }
      });
      return;
    }

    const formData = new FormData();

    // Ajout des données du formulaire
    formData.append('user', this.tokenStorage.getUser()?.data.user_id.toString());
    formData.append('name', this.productForm.get('name').value.trim().toLowerCase());
    formData.append('regular_price', this.productForm.get('regular_price').value);
    formData.append('sale_price', this.productForm.get('sale_price').value);
    formData.append('summary', this.productForm.get('summary').value);
    formData.append('isbn', this.productForm.get('isbn').value.trim().toLowerCase());
    formData.append('page_num', this.productForm.get('page_num').value);
    formData.append('published_year', this.productForm.get('published_year').value);
    formData.append('author_name', this.productForm.get('author_name').value.trim().toLowerCase());
    formData.append('genre', this.productForm.get('genre').value);
    formData.append('age', this.productForm.get('age').value);

    // formData.append('categories', [this.productForm.get('categories').value)];

    // Envoie les catégories comme tableau d'entiers
    // Ajout de chaque ID de catégorie comme un champ distinct

    const categories = this.productForm.get('categories').value; // array of integers
    categories.forEach((category) => {
      formData.append('categories[]', category.toString()); // Appending each integer directly
    });

    // Ajout du fichier `downloads`
    if (this.downloadsFile) {
      formData.append('downloads', this.downloadsFile);
    }

    // Ajout des fichiers pour les couvertures
    if (this.front_cover.length > 0) {
      formData.append('front_cover', this.front_cover[0]);
    }

    if (this.back_cover.length > 0) {
      formData.append('back_cover', this.back_cover[0]);
    }


    // Appel de l'API
    this.crudService.addDataWithHeader(environment.api_url + 'products/', formData, this.userConnectedHeader)
        .pipe(take(1))
        .subscribe(data => {
          this.toastr.success("Produit ajouté avec succès !");
          console.log(data);
        }, error => {
          console.log(error);
        });
  }


  // Gérer le succès de l'upload pour l'image principale
  onMainImageUploadSuccess(event: any) {
    const file = event && event.file ? event.file : event; // Vérification du fichier

    if (file instanceof Blob) {  // Vérifie que le fichier est bien du type Blob
      this.front_cover = [<File>file]; // Remplace le fichier principal existant

      // Créer une URL temporaire pour le fichier, à utiliser pour afficher un aperçu dans le HTML
      this.mainImagePreview = URL.createObjectURL(file);
    } else {
      console.error("Le fichier fourni n'est pas valide : ", file);
    }
  }


  // Gérer le succès de l'upload. C'est plus un variant juste une seule image
  onVariantImageUploadSuccess(event: any) {
    const file = event && event.file ? event.file : event; // Vérification du fichier

    if (file instanceof Blob) {  // Vérifie que le fichier est bien du type Blob
      this.back_cover = [<File>file]; // Remplace le fichier principal existant


      // Créer une URL temporaire pour le fichier, à utiliser pour afficher un aperçu dans le HTML
      this.variantImagePreviews = URL.createObjectURL(file);
    } else {
      this.toastr.warning("Le fichier fourni n'est pas valide !");
    }
  }


  // File remove for variant images
  removeVariantImage(index: number) {
    this.back_cover.splice(index, 1);
    // this.variantImagePreviews.splice(index, 1); // Supprimer l'aperçu correspondant
  }

  openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content);
  }





  validatePositiveNumber(event: KeyboardEvent) {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  }


  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
