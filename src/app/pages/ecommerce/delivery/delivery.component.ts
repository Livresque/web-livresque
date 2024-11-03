import { Component, QueryList, ViewChildren } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {UntypedFormBuilder, UntypedFormGroup, FormArray, Validators, ValidationErrors} from '@angular/forms';

import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import {
    addDeliverylist,
    addDeliverylistFailure,
    fetchDeliveryData,
    updateDeliverylist
} from 'src/app/store/delivery/delivery.action';
import {selectDataDelivery, selectDataState} from 'src/app/store/delivery/delivery-selector';
import {ReusableFunctionService} from "../../../core/services/reusable-function.service";
import {ToastrService} from "ngx-toastr";
import {environment} from "../../../../environments/environment.prod";
import {DeliveryModel} from "../../../store/delivery/delivery.model";
import {User} from "../../../store/Authentication/auth.models";

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
  providers: [DecimalPipe]
})

/**
 * Ecomerce Customers component
 */
export class DeliveryComponent {
  endItem: any
  modalRef?: BsModalRef;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  formData: UntypedFormGroup;
  editFormData: UntypedFormGroup;
  submitted: boolean = false;
  term: any;

  // page
  currentpage: number;
  returnedArray: any
  // Table data
  content?: any;
  customersData: DeliveryModel[];
  total: Observable<number>;

  page: any = 1;

  // File Upload
  imageURL: string | undefined;

  protected readonly environment = environment;
  selectValue = ['Disponible', 'Pas disponible'];

   randomDelveryPassword: string = "";

  isSuccess = false;

  surnameArrays: string[] = []
  userInput: string = ''; // Stockage de l'entrée utilisateur
  isMatching: boolean = false; // Indicateur de correspondance


  //Filter Actif or not
  selectedFilterActifOrNot:string = ""
  itemsSelectedFilterActifOrNot = [
    { value: "Disponible", label: 'Disponible' },
    { value: "Non disponible", label: 'Non disponible' },
  ];
  tempsCustomersData!: DeliveryModel[]

  constructor(
      private modalService: BsModalService,
      private formBuilder: UntypedFormBuilder,
      private datePipe: DatePipe,
      public store: Store,
      public reusableFuction: ReusableFunctionService,
      public toastr:ToastrService

  ) {


  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Livreur(s)', active: true }];

    this.formData = this.formBuilder.group({
      id: [''],
      surname: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      delivery_image: ['', [Validators.required]],
        password: [this.randomDelveryPassword.trim(), [Validators.required]], // Utilisation du mot de passe généré
        is_available: [null, Validators.required]
    });

    this.editFormData = this.formBuilder.group({
      id: [''],
      surname: ['', [Validators.required]],
      first_name: [''],
      last_name: [''],
      phone: [''],
      email: [''],
      address: [''],
      delivery_image: [null],
      is_available: [null]
    });

    this.currentpage = 1;
    this.refreshOderData()

  }

  fileChange(event: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      document.querySelectorAll('#member-img').forEach((element: any) => {
        element.src = this.imageURL;
      });
      this.formData.controls['delivery_image'].setValue(this.imageURL);
    }
    reader.readAsDataURL(file)
  }

  get form() {
    return this.formData.controls;
  }

  validateForm() {
    const form = this.formData;

    if (form.invalid) {
      // Display error messages and prevent form submission
      form.markAllAsTouched();
      return false;
    }

    return true;
  }
  /**
   * Open modal
   * @param content modal content
  */
  openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content);
  }


  onButtonClick() {
    this.isSuccess = true;
    // Revenir à la classe dark après 3 secondes
    setTimeout(() => {
      this.isSuccess = false;
    }, 5000); // 3000 millisecondes = 3 secondes

  }

  /**
   * Open Edit modal
   * @param refresh table data content
   */
  refreshOderData(){
    // Fetch data
    this.surnameArrays = []
    this.store.dispatch(fetchDeliveryData());
    this.store.select(selectDataDelivery).subscribe((data: DeliveryModel[])=>{
      console.log(data)

      if (data.length>0){
        data.forEach(m=>{
          this.surnameArrays.push(m.surname)
        })
      }
      this.customersData = data
      this.returnedArray = data
      this.tempsCustomersData = data
      this.customersData = this.returnedArray.slice(0, 8)
    })
  }


  verifyIfSurnameExist(event: any): void {
    const input = (event.target as HTMLInputElement).value;
    this.userInput = input;
    if (this.surnameArrays.includes(this.userInput)) {
      this.isMatching = true ;
      this.toastr.error("Ce nom d'utilisateur est déjà enregistré", 'Erreur');
    }else{
      this.isMatching = false ;
    }

  }

  /**
   * Open Edit modal
   * @param content modal content
   */
  editDataGet(id: any, content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });

    this.editFormData.patchValue(this.customersData[id]);
    // this.store.dispatch(updateDeliverylist())
    // console.log(this.customersData[id])
  }



  // Save customer
  saveEditCustomer() {
    const deliveryInfos = this.editFormData.value;
    if (deliveryInfos && deliveryInfos.hasOwnProperty('delivery_image')) {
      delete deliveryInfos.delivery_image;
      delete deliveryInfos.surname;
    }
    console.log(deliveryInfos);

    this.store.dispatch(updateDeliverylist({updatedData:deliveryInfos}))

    setTimeout(()=>{
      this.refreshOderData()
    }, 2000)

  }


  saveCustomer() {
    const formDataValues = this.formData.value;

    this.formData.patchValue({
      surname: formDataValues.surname ? formDataValues.surname.trim() : '',
      first_name: formDataValues.first_name ? formDataValues.first_name.trim() : '',
      last_name: formDataValues.last_name ? formDataValues.last_name.trim() : '',
      phone: formDataValues.phone ? formDataValues.phone.trim() : '',
      email: formDataValues.email ? formDataValues.email.trim() : '',
      address: formDataValues.address ? formDataValues.address.trim() : ''
    });

    if (this.isMatching){
      this.toastr.error("Le nom d'utilisateur saisi est deja utiliser", "Erreur")
    }else{
      if (this.formData.valid){

        // Transformer le surname en minuscule à chaque changement de valeur
        this.formData.get('surname')?.valueChanges.subscribe(value => {
          if (value) {
            this.formData.get('surname')?.setValue(value.toLowerCase(), { emitEvent: false });
          }
        });

        const deliveryInfos = this.formData.value
        this.store.dispatch(addDeliverylist({newData:deliveryInfos}))

        this.store.select(selectDataDelivery).subscribe((m: any)=>{
          console.log("success");
          console.log(m);
          this.toastr.success("Livreur enregistrer avec succes et ces identifiants lui ont ete Envoyer", 'Succes');
          this.formData.reset();

        },error => {
          this.toastr.error("Impossible d'enregistrer ce livreur. Contacter l'administrateur", 'Erreur');
        })

        setTimeout(()=>{
          this.store.select(selectDataState).subscribe((m:any)=>{
            console.log("erreur du state")
            console.log(m)
          })
        }, 5000)
      }else{
        Object.keys(this.formData.controls).forEach(key => {
          const controlErrors: ValidationErrors = this.formData.get(key)?.errors;
          if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
              const errorMessage = this.reusableFuction.getErrorMessage(key, controlErrors);
              console.log(errorMessage);
              this.toastr.error(errorMessage, 'Erreur');
            });
          }
        });
      }
    }





    // if (this.formData.valid) {
    //   if (this.formData.get('id')?.value) {
    //     const updatedData = this.formData.value;
    //     this.store.dispatch(updateCustomerlist({ updatedData }));
    //   } else {
    //     const dates = new Date();
    //     const formattedDate = this.datePipe.transform(dates, 'dd MMM, yyyy');
    //     this.formData.controls['date'].setValue(formattedDate);
    //
    //     const newData = this.formData.value
    //     this.store.dispatch(addCustomerlist({ newData }));
    //   }
    //
    //   this.modalService?.hide()
    //   setTimeout(() => {
    //     this.formData.reset();
    //   }, 2000);
    //   this.submitted = true
    // }
    // }
  }

  // Delete Data
  delete(id: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
          document.getElementById('c_' + id)?.remove();
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          );
        }
      });
  }


  // pagechanged
  pageChanged(event: any) {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.customersData = this.returnedArray.slice(startItem, this.endItem)
  }

  // fiter job

  selectname() {
    if (this.term) {
      this.customersData = this.returnedArray.filter((es: any) => {
        return es.surname.toLowerCase().includes(this.term.toLowerCase())
      })
    } else {
      this.customersData = this.returnedArray
    }
  }


  selectedFilterActifOrNotFunction() {
    if (this.customersData.length === 0){
      this.customersData = this.tempsCustomersData;
      console.log("customersData est vide");
      console.log(this.customersData);
    }else{
      if (this.selectedFilterActifOrNot.length>0) {
        this.customersData = this.customersData.filter((es: DeliveryModel) => {
          return es.is_available === this.selectedFilterActifOrNot.toString()
        });
        console.log(this.customersData);
        console.log(this.selectedFilterActifOrNot);
      } else {
        this.customersData = this.tempsCustomersData;
      }
    }
  }

  onGeneratePassword(): void {
      this.randomDelveryPassword = this.reusableFuction.generateRandomPassword(7); // Générer un nouveau mot de passe
      this.formData.patchValue({
          password: this.randomDelveryPassword // Mise à jour du champ password
      });
  }


}