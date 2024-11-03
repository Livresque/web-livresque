import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SlickCarouselComponent} from 'ngx-slick-carousel';
import {Product} from "../../../core/models/products.models";
import {CrudService} from "../../../core/services/crud.service";
import {environment} from "../../../../environments/environment.prod";
import {take} from "rxjs";
import {UserProductsDataService} from "../../../core/services/user-products-data.service";
import {ReusableFunctionService} from "../../../core/services/reusable-function.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {DropzoneConfigInterface} from "ngx-dropzone-wrapper";
import {TokenStorageService} from "../../../core/services/token-storage.service";
import {Editor, Toolbar} from "ngx-editor";

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.scss']
})

/**
 * Ecommerce product-detail component
 */
export class ProductdetailComponent implements OnInit, OnDestroy {
  carouselReference: any
  breadCrumbItems: Array<{}>;
  public productDetail!: Product;

  isImage: string;
  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;

  //to indentifier categories
  categoryName: string = ""
  /**
   * onclick Image show
   * @param event image passed
   */
  imageShow(event) {
    const image = event.target.src;
    this.isImage = image;
    const expandImg = document.getElementById('expandedImg') as HTMLImageElement;
    expandImg.src = image;
  }

  // tabbed-carousel.component.ts
  carouselOptions = {
    items: 1,
    nav: false,
    dots: false,
    loop: false,
    autoplay: false, // You can set this to true if you want automatic sliding.
  };
  tabs = [];
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    // rtl: this.isRTL
  };
  config = {
    slidesToShow: 5,
    slidesToScroll: 1,
    vertical: true,
    arrows: true,
  }


  //Modal
  // Create new Categorie
  modalRef?: BsModalRef;
  submitted: boolean = false;

  //Product form
  productForm: UntypedFormGroup;
  submit: boolean = false;
  mainImageFiles: File[] = [];
  variantImageFiles: File[] = [];
  mainImagePreview: string | null = null; // Pour stocker l'aperçu de l'image principale
  variantImagePreviews: string[] = []; // Pour stocker les aperçus des images variantes

  // Categories for the ng-select
  categoriesUpdate: {id: number, property1: string}[] = [];
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
    ['undo', 'redo']
  ];

  constructor(
      private route: ActivatedRoute,
      private crudService: CrudService,
      private userProductsDataService: UserProductsDataService,
      public reusableFunction: ReusableFunctionService,
      private modalService: BsModalService,
      private tokenStorage: TokenStorageService,
      public formBuilder: UntypedFormBuilder,
      public toastr:ToastrService,
  ) {}
  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Product Detail', active: true }];

    // Initializing form controls
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      // name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      manufacture_name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      manufacture_brand: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      price: ['', [Validators.required, Validators.min(0)]],
      promotional_price: ['', [Validators.required, Validators.min(0)]],
      category: [null, [Validators.required]],
      features: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(1)]],  // Optional
      weight: ['', []],    // Optional
      size: ['', []],      // Optional
      dimensions: ['', []],// Optional
      productOptions: [[]],  // Champ non obligatoire
      product_state: [null, []],  // Optional ng-select
      stock_state: [null, []]     // Optional ng-select
    });

    // Texte editeur
    this.editor = new Editor();
    this.refreshData();
  }

// Recupere la categorie et identifie le nom associé
  getCurrentUserCategorie() {
    this.userProductsDataService.fetchCurrentUserCategories();
    this.userProductsDataService.getCategoryList()
        .subscribe((categories: { id: number, property1: string }[]) => {
          this.categoriesUpdate = categories;
          categories.forEach(item => {
            if (item.id === this.productDetail.category) {
              this.categoryName = item.property1;
            } else {
              console.log("rien trouver");
            }
          });
        });
  }

// slick tab change
  slickChange(event: any) {
    const swiper = document.querySelectorAll('.nav-link');
  }

  slidePreview(id: any, event: any) {
    const swiper = document.querySelectorAll('.nav-link');
    swiper.forEach((el: any) => {
      el.classList.remove('active');
    });
    event.target.closest('.nav-link').classList.add('active');
    this.slickModal.slickGoTo(id);
  }

  openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content);
    // this.autoSetForm();
  }

  get form() {
    return this.productForm.controls;
  }

  async validSubmit() {
    this.submit = true;

    if (this.productForm.invalid) {
      this.toastr.error("Formulaire invalide. Certains champs sont requis !");
      this.productForm.markAllAsTouched();
      return;
    }

    const productData: any = {};
    const normalize = (value: any) => typeof value === 'string' ? value.trim().toLowerCase() : value;

    productData.user = this.tokenStorage.getUser().id;
    productData.name = normalize(this.productForm.get('name').value);
    productData.manufacture_name = normalize(this.productForm.get('manufacture_name').value);
    productData.manufacture_brand = normalize(this.productForm.get('manufacture_brand').value);
    productData.price = normalize(this.productForm.get('price').value);
    productData.promotional_price = normalize(this.productForm.get('promotional_price').value);
    productData.category = normalize(this.productForm.get('category').value);
    productData.features = normalize(this.productForm.get('features').value);

    const optionalFields = ['quantity', 'weight', 'size', 'dimensions', 'product_state', 'stock_state'];
    optionalFields.forEach(field => {
      const controlValue = this.productForm.get(field).value;
      if (controlValue) {
        productData[field] = normalize(controlValue);
      }
    });

    //Recuperer le champs options
    const optionField: { display: string, value: string }[] = this.productForm.get('productOptions').value;
    // Extraire uniquement les 'value' et les séparer par '#'
    const valuesString = optionField.map(option => option.value).join('#');
    productData.productOptions = normalize(valuesString);

    if (this.mainImagePreview) {
      productData.main_image = this.mainImagePreview;
    }

    if (this.variantImagePreviews.length > 0) {
      productData.variant_images = this.variantImagePreviews.map(image => ({ variant_image: image }));
    }

    console.log(productData)
    this.crudService.patchData(environment.api_url + `products/${this.productDetail.id}/update/`, productData)
        .pipe(take(1))
        .subscribe(m => {
          this.toastr.success("Produit mis à jour avec succès !");
          setTimeout(() => {
            this.refreshData();
          }, 1500);
        }, error => {
          console.error(error);
        });
  }

// Auto set form with detail values
//   async autoSetForm() {
//
//     if (this.productDetail){
//       this.productForm.patchValue({
//         name: this.productDetail.name,
//         manufacture_name: this.productDetail.manufacture_name,
//         manufacture_brand: this.productDetail.manufacture_brand,
//         price: this.productDetail.price,
//         promotional_price: this.productDetail.promotional_price,
//         category: this.productDetail.category,
//         features: this.productDetail.features,
//         quantity: this.productDetail.quantity,
//         weight: this.productDetail.weight,
//         size: this.productDetail.size,
//         dimensions: this.productDetail.dimensions,
//         // productOptions: this.reusableFunction.splitValuesString(this.productDetail?.productOptions),
//         product_state: this.productDetail.product_state,
//         stock_state: this.productDetail.stock_state
//       });
//     }
//
//     if (this.productDetail.main_image) {
//       this.mainImagePreview = await this.reusableFunction.convertImageUrlToBase64(environment.api_url + 'media/' + this.productDetail.main_image);
//     } else {
//       this.mainImagePreview = "";
//     }
//
//     if (this.productDetail.variant_images && this.productDetail.variant_images.length > 0) {
//       for (const img of this.productDetail.variant_images) {
//         this.variantImagePreviews.push(await this.reusableFunction.convertImageUrlToBase64(environment.api_url + 'media/' + img.variant_image));
//       }
//     } else {
//       this.variantImagePreviews = [];
//     }
//   }

  refreshData() {
    this.tabs = [];
    this.variantImagePreviews = [];

    this.route.params.pipe(take(1))
        .subscribe((param) => {
          this.crudService.fetchDataOne(environment.api_url + `products/${param.id}/`)
              .pipe(take(1))
              .subscribe(async (data: Product) => {
                this.productDetail = data;
                console.log("data")
                console.log(data)
                this.isImage = this.productDetail.main_image;

                this.tabs.push({
                  image: environment.api_url + 'media/' + this.productDetail.main_image,
                  selected: true
                });

                if (this.productDetail.variant_images && this.productDetail.variant_images.length > 0) {
                  for (const img of this.productDetail.variant_images) {
                    const base64Image = await this.reusableFunction.convertImageUrlToBase64(environment.api_url + 'media/' + img.variant_image);
                    this.tabs.push({
                      image: base64Image,
                      selected: false
                    });
                  }
                }
                /////////////
                if (this.productDetail) {
                  this.productForm.patchValue({
                    name: this.productDetail.name,
                    manufacture_name: this.productDetail.manufacture_name,
                    manufacture_brand: this.productDetail.manufacture_brand,
                    price: this.productDetail.price,
                    promotional_price: this.productDetail.promotional_price,
                    category: this.productDetail.category,
                    features: this.productDetail.features,
                    quantity: this.productDetail.quantity,
                    weight: this.productDetail.weight,
                    size: this.productDetail.size,
                    dimensions: this.productDetail.dimensions,
                    product_state: this.productDetail.product_state,
                    stock_state: this.productDetail.stock_state
                  });
                }

                if (this.productDetail?.productOptions){
                  this.productForm.patchValue({
                    productOptions: this.reusableFunction.splitValuesString(this.productDetail.productOptions),
                  })

                }

                if (this.productDetail.main_image) {
                  this.mainImagePreview = await this.reusableFunction.convertImageUrlToBase64(environment.api_url + 'media/' + this.productDetail.main_image);
                } else {
                  this.mainImagePreview = "";
                }


                if (this.productDetail.variant_images && this.productDetail.variant_images.length > 0) {
                  for (const img of this.productDetail.variant_images) {
                    this.variantImagePreviews.push(await this.reusableFunction.convertImageUrlToBase64(environment.api_url + 'media/' + img.variant_image));
                  }
                } else {
                  this.variantImagePreviews = [];
                }

                this.getCurrentUserCategorie();
              });
        });
  }
  validatePositiveNumber(event: KeyboardEvent) {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
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

  ngOnDestroy(): void {
    this.editor.destroy();
  }

}
