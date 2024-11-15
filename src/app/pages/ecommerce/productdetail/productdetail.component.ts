import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SlickCarouselComponent} from 'ngx-slick-carousel';
import {Product} from "../../../core/models/products.models";
import {CrudService} from "../../../core/services/crud.service";
import {environment} from "../../../../environments/environment.prod";
import {take} from "rxjs";
import {UserProductsDataService} from "../../../core/services/user-products-data.service";
import {ReusableFunctionService} from "../../../core/services/reusable-function.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {DropzoneConfigInterface} from "ngx-dropzone-wrapper";
import {TokenStorageService} from "../../../core/services/token-storage.service";
import {Editor, Toolbar} from "ngx-editor";
import {HttpHeaders} from "@angular/common/http";

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
  categoryName: string = "lhhjk"
  currentUserCategories: { id: number; property1: string }[];

  // current user
    currentUserId!: number

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
    front_cover: File[] = [];
    back_cover: File[] = [];
    mainImagePreview: string | null = null; // Pour stocker l'aperçu de l'image principale
    variantImagePreviews: string | null = null; // Pour stocker les aperçus des images variantes

    // File pdf
    downloadsFile: File | null = null;

    // Categories for the ng-select
    // currentUserCategories: {id: number, property1: string}[] = [];

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

    userConnectedHeader!: HttpHeaders
  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private crudService: CrudService,
      private userProductsDataService: UserProductsDataService,
      public reusableFunction: ReusableFunctionService,
      private modalService: BsModalService,
      private tokenStorage: TokenStorageService,
      public formBuilder: UntypedFormBuilder,
      public toastr:ToastrService,
      private reusFunction: ReusableFunctionService,
      private cdr: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Product Detail', active: true }];

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


      this.userConnectedHeader = new HttpHeaders({
          'Authorization': `Token ${this.tokenStorage.getRefreshToken()}`
      })



    // Texte editeur
    this.editor = new Editor();

    this.getCurrentUserCategorie()
    this.currentUserId = this.tokenStorage.getUser().data.user_id
    this.refreshData();
    this.cdr.detectChanges();
  }

// Recupere la categorie et identifie le nom associé
  getCurrentUserCategorie() {
      // Récupérer les catégories de l'utilisateur lors de l'initialisation
      this.userProductsDataService.fetchCurrentUserCategories();

      // S'abonner aux catégories pour afficher les données dans le composant
      this.userProductsDataService.getCategoryList().subscribe(categories => {
          this.currentUserCategories = categories;
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

  refreshData() {
    this.tabs = [];
    this.variantImagePreviews = "";
      console.log(this.tokenStorage.getRefreshToken())

    this.route.params.pipe(take(1))
        .subscribe((param) => {
          this.crudService.fetchDataOne(environment.api_url + `products/${param.id}/`)
              .pipe(take(1))
              .subscribe(async (data: Product) => {
                  if (data){
                      console.log(data)
                      this.productDetail = data;
                      console.log("data")
                      console.log(data)
                      this.isImage = this.productDetail.front_cover;

                      this.tabs.push({
                          image: this.productDetail.front_cover,
                          selected: true
                      });

                      if (this.productDetail.back_cover) {
                          // const base64Image = await this.reusableFunction.convertImageUrlToBase64(environment.api_url + 'media/' + this.productDetail.back_cover);
                          this.tabs.push({
                              image: this.productDetail.back_cover,
                              selected: false
                          });
                      }
                      /////////////
                      if (this.productDetail) {
                          this.productForm.patchValue({
                              name: this.productDetail.name,
                              regular_price: this.productDetail.regular_price ,
                              sale_price: this.productDetail.sale_price,
                              isbn: this.productDetail.isbn,
                              page_num: this.productDetail.page_num,
                              published_year: this.productDetail.published_year,
                              author_name: this.productDetail.author_name,
                              summary: this.productDetail.summary,
                              genre: [null],
                              age: this.productDetail.age,
                              categories: this.productDetail.categories.map(catData=>{
                                  return catData.name
                              })

                              // downloads: [null]
                          });
                      }


                      if (this.productDetail.front_cover) {
                          this.mainImagePreview = this.productDetail.front_cover;
                      } else {
                          this.mainImagePreview = "";
                      }


                      if (this.productDetail.back_cover ) {
                          this.variantImagePreviews = this.productDetail.back_cover

                      } else {
                          this.variantImagePreviews = "";
                      }
                  }
              });
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
        formData.append('author_name', this.productForm.get('author_name').value?.trim().toLowerCase());
        formData.append('genre', this.productForm.get('genre').value);
        formData.append('age', this.productForm.get('age').value);

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

        formData.forEach((value, key) => {
            console.log(key, value)
        })


        console.log(this.currentUserId)
        // Appel de l'API pour la mise a jour
        this.crudService.updateDataOneWithHeader(
            environment.api_url + 'products/'+this.productDetail.id+'/',
            formData,
            this.userConnectedHeader)
            .pipe(take(1))
            .subscribe(data => {
                this.toastr.success("Produit ajouté avec succès !");
                setTimeout(()=>{
                    location.reload();
                }, 1500)
            }, error => {
                console.log(error);
            });
    }

    removeProductByIf(){
        this.crudService.deleteDataOneWithHeader(
            environment.api_url + 'products/'+this.productDetail.id+'/',
            this.userConnectedHeader
            )
            .pipe(take(1))
            .subscribe(data => {
                this.toastr.success("Produit Supprimer avec succès !");
                setTimeout(()=>{
                    this.router.navigate(['/ecommerce/products'])
                }, 1500)
            }, error => {
                console.log(error);
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
//     if (this.productDetail.front_cover) {
//       this.mainImagePreview = await this.reusableFunction.convertImageUrlToBase64(environment.api_url + 'media/' + this.productDetail.front_cover);
//     } else {
//       this.mainImagePreview = "";
//     }
//
//     if (this.productDetail.back_cover && this.productDetail.back_cover.length > 0) {
//       for (const img of this.productDetail.back_cover) {
//         this.variantImagePreviews.push(await this.reusableFunction.convertImageUrlToBase64(environment.api_url + 'media/' + img.variant_image));
//       }
//     } else {
//       this.variantImagePreviews = [];
//     }
//   }
  validatePositiveNumber(event: KeyboardEvent) {
    if (event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

}
