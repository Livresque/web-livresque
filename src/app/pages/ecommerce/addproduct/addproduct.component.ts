import {Component, OnDestroy, OnInit} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {DropzoneConfigInterface} from "ngx-dropzone-wrapper";
import {TokenStorageService} from "../../../core/services/token-storage.service";
import {ReusableFunctionService} from "../../../core/services/reusable-function.service";
import {CrudService} from "../../../core/services/crud.service";
import {environment} from "../../../../environments/environment.prod";
import {Subscription, take} from "rxjs";
import {any} from "@amcharts/amcharts5/.internal/core/util/Array";
import {ToastrService} from "ngx-toastr";
import {ProductsCategoriesModels} from "../../../core/models/products.models";
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
  mainImageFiles: File[] = [];
  variantImageFiles: File[] = [];
  mainImagePreview: string | null = null; // Pour stocker l'aperçu de l'image principale
  variantImagePreviews: string[] = []; // Pour stocker les aperçus des images variantes

  // Categories for the ng-select
  categories: {id: number, property1: string}[] = [];
  product_states: string[] = ['Neuf', 'Reconditionné', 'Occasion'];
  stock_states: string[] = ['En stock', 'Sous commande', 'En réapprovisionnement'];

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
        console.log("Image principale ajoutée :", file);
      });

      this.on("complete", function(file) {
        console.log("Upload terminé pour l'image variante :", file);
      });
    }
  };

  variantImagesDropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    uploadMultiple: true,
    previewsContainer: false,
    autoProcessQueue: false, // Ne traite pas les fichiers automatiquement
    init: function() {
      this.on("addedfile", function(file) {
        console.log("Image variante ajoutée :", file);
      });

      this.on("complete", function(file) {
        console.log("Upload terminé pour l'image variante :", file);
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
      name: ['teste', [Validators.required]],
      manufacture_name: ['teste', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      manufacture_brand: ['teste', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      price: ['2000', [Validators.required, Validators.min(0)]],
      promotional_price: ['0', [Validators.required, Validators.min(0)]],
      category: [null, [Validators.required]],
      features: ['', [Validators.required]],
      quantity: ['1', [Validators.required, Validators.min(1)]],  // Optional
      weight: ['', []],    // Optional
      size: ['', []],      // Optional
      dimensions: ['', []],// Optional
      productOptions: [[]],  // Champ non obligatoire
      product_state: [null, []],  // Optional ng-select
      stock_state: [null, []]     // Optional ng-select
    });

    this.formDataCategorie = this.formBuilder.group({
      user: [null],
      name: ['', [Validators.required]] // champ pour le nom de la catégorie, obligatoire
    });

     this.currentUserId = this.tokenStorage.getUser().id
    //Recuperer les categories de l'utilsateur courant
    this.getCurrentUserCategorie();

     //Texte edditor
    this.editor = new Editor();
  }

  async validSubmit() {
    this.submit = true;

    // Vérifie si le formulaire est valide avant de procéder
    if (this.productForm.invalid) {
      console.log('Form is invalid');
      this.toastr.error("Formulaire invalide. Certains champs sont requis !")
      this.productForm.markAllAsTouched(); // Optionnel
      return;
    }

    // Crée un objet JavaScript pour stocker les données
    const productData: any = {};

    // Fonction pour normaliser les valeurs (minuscules et trim)
    const normalize = (value: any) => {
      return typeof value === 'string' ? value.trim().toLowerCase() : value;
    };

    // Champs obligatoires
    productData.user = this.tokenStorage.getUser().id;
    productData.name = normalize(this.productForm.get('name').value);
    productData.manufacture_name = normalize(this.productForm.get('manufacture_name').value);
    productData.manufacture_brand = normalize(this.productForm.get('manufacture_brand').value);
    productData.price = normalize(this.productForm.get('price').value);
    productData.promotional_price = normalize(this.productForm.get('promotional_price').value);
    productData.category = normalize(this.productForm.get('category').value);
    productData.features = normalize(this.productForm.get('features').value);
    productData.features = normalize(this.productForm.get('features').value);


    //Recuperer le champs options
    const optionField: { display: string, value: string }[] = this.productForm.get('productOptions').value;
    // Extraire uniquement les 'value' et les séparer par '#'
    const valuesString = optionField.map(option => option.value).join('#');
    productData.productOptions = normalize(valuesString);


    // Champs facultatifs - ajout uniquement si la valeur est fournie
    const optionalFields = ['quantity', 'weight', 'size', 'dimensions', 'product_state', 'stock_state'];
    optionalFields.forEach(field => {
      const controlValue = this.productForm.get(field).value;
      if (controlValue) {
        productData[field] = normalize(controlValue);
      }
    });

    // Gérer l'image principale en base64 si elle existe
    if (this.mainImagePreview) {
      productData.main_image = this.mainImagePreview;  // Ajouter l'image principale (base64)
    }

    // Debug: Vérifiez le contenu de variantImagePreviews avant de l'ajouter
    console.log('variantImagePreviews avant ajout:', this.variantImagePreviews);

    // Gérer les images variantes en base64 sous forme de tableau
    if (this.variantImagePreviews.length > 0) {
      // Transformer chaque image en un objet avec la clé `variant_image`
      productData.variant_images = this.variantImagePreviews.map(image => ({ variant_image: image }));
    } else {
      console.log('Aucune image variante trouvée. variants_image sera vide.');
    }

    // Afficher les données sous forme de JSON dans la console
    console.log('Données à envoyer sous forme de JSON :', JSON.stringify(productData, null, 2));

    // Appelle de l'api et soumission des donnees
    this.crudService.addData(environment.api_url+'products/create/', productData)
        .pipe(take(1))
        .subscribe(m=>{
          this.toastr.success("Produit ajouter avec success !")
          console.log(m)
        }, error => {
          console.log(error)
        })

  }

  // Handle upload success for main image
  onMainImageUploadSuccess(event: any) {
    const file = event && event.file ? event.file : event;  // Vérification du fichier

    if (file instanceof Blob) {  // Vérifie que le fichier est bien du type Blob (File est un type de Blob)
      // Remplacer tout fichier existant
      this.mainImageFiles = [];

      // Ajouter le fichier à mainImageFiles
      this.mainImageFiles.push(<File>file);

      console.log("Fichier ajouté à mainImageFiles:", this.mainImageFiles);

      // Si vous avez besoin d'obtenir le dataURL pour un usage ultérieur
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const dataURL = e.target.result;  // Récupère le dataURL du fichier
        this.mainImagePreview = dataURL;
      };

      reader.readAsDataURL(file);  // Lire le fichier en tant que dataURL
    } else {
      console.error("Le fichier fourni n'est pas valide : ", file);
    }
  }

  // Handle upload success for variant images
  onVariantImageUploadSuccess(event: any) {
    // Vérification du fichier
    const file = event && event.file ? event.file : event;

    if (file instanceof Blob) {  // Vérifie que le fichier est bien du type Blob (File est un type de Blob)
      // Ajouter le fichier à variantImageFiles (permettant plusieurs images)
      this.variantImageFiles.push(<File>file);

      console.log("Fichier ajouté à variantImageFiles:", this.variantImageFiles);

      // Si vous avez besoin d'obtenir le dataURL pour un usage ultérieur
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const dataURL = e.target.result;  // Récupère le dataURL du fichier
        console.log("dataURL de l'image variante:", dataURL);

        // Stocker le dataURL dans variantImagePreviews pour prévisualisation
        this.variantImagePreviews.push(dataURL);
      };

      reader.readAsDataURL(file);  // Lire le fichier en tant que dataURL
    } else {
      console.error("Le fichier fourni n'est pas valide : ", file);
    }
  }


  // File remove for variant images
  removeVariantImage(index: number) {
    this.variantImageFiles.splice(index, 1);
    this.variantImagePreviews.splice(index, 1); // Supprimer l'aperçu correspondant
  }

  openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content);
  }

  //Recuperer la categorie
  getCurrentUserCategorie(){
    // Récupérer les catégories de l'utilisateur lors de l'initialisation
    this.userProductsDataService.fetchCurrentUserCategories();

    // S'abonner aux catégories pour afficher les données dans le composant
    this.userProductsDataService.getCategoryList().subscribe(categories => {
      this.categories = categories;
    });
  }

  // Sauvegarder la catégorie
  saveCategories() {
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
      user: this.currentUserId,
      name: this.reusFunction.NormaliseToLowerCase(this.formDataCategorie.get('name').value).trim()
    })

    const categoryData = this.formDataCategorie.value;

    console.log('Données de la catégorie sauvegardée : ', categoryData);

    this.crudService.addData(environment.api_url+'category/create/', this.formDataCategorie.value)
        .pipe(take(1))
        .subscribe((data: any)=>{
          this.toastr.success(`La catégorie ${this.formDataCategorie.get('name').value} est a été creer avec succè !`)
          //Recuperer et rafraichir les categories de l'utilsateur courant
          this.getCurrentUserCategorie();
        }, error => {
          this.toastr.error("Une erreur est survenu lors de la creation de la catégorie veuillez contacter le support. Merci !")
        })

    // Fermer la modal après sauvegarde
    this.modalRef?.hide();
  }

  // Vérifier si la catégorie existe déjà
  verifyIfCategoryExists(event: Event) {
    const input = (event.target as HTMLInputElement).value.toLowerCase().trim();
    console.log('Vérification si la catégorie existe : ', input);

    // Utiliser `.some` pour vérifier si un nom de catégorie correspond à l'input
    const categoryExists = this.categories.some(category =>
        category.property1.toLowerCase() === input
    );

    if (categoryExists) {
      this.toastr.warning("Cette catégorie existe déjà !");
      this.categorieExist = true;
    } else {
      this.categorieExist = false;
    }
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
