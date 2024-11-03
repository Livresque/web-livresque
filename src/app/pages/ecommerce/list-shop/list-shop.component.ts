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
import {User, UserRegister} from "../../../store/Authentication/auth.models";
import {CrudService} from "../../../core/services/crud.service";

@Component({
  selector: 'list-shop',
  templateUrl: './list-shop.component.html',
  styleUrls: ['./list-shop.component.scss'],
  providers: [DecimalPipe]
})

/**
 * Ecomerce Customers component
 */
export class ListShopComponent {
  endItem: any
  modalRef?: BsModalRef;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  formData: UntypedFormGroup;
  submitted: boolean = false;
  term: any;

  // page
  currentpage: number;
  returnedArray: any
  // Table data
  content?: any;

  total: Observable<number>;

  page: any = 1;


  isSuccess = false;





  //Filter Actif or not
  selectedFilterActifOrNot:string = ""
  itemsSelectedFilterActifOrNot = [
    { value: true, label: 'Actif' },
    { value: false, label: 'Non actif' },
  ];
  customersData!: User[]
  tempsCustomersData!: User[]

  constructor(
      public toastr:ToastrService,
      public store: Store,
      private crudService: CrudService
  ) {


  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Liste des partenaire', active: true }];
    this.currentpage = 1;
    this.refreshOderData()
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
  refreshOderData() {
    this.crudService.fetchData(environment.api_url + 'users/')
        .subscribe((userItems: User[]) => {
          this.customersData = userItems.filter(m => m.role === "partenaire");
          this.tempsCustomersData = userItems.filter(m => m.role === "partenaire");

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
    }else{
      if (this.selectedFilterActifOrNot) {
        this.customersData = this.customersData.filter((es: User) => {
          return es.is_active === JSON.parse(this.selectedFilterActifOrNot)
        });
        console.log(this.customersData);
      } else {
        this.customersData = this.tempsCustomersData;
      }
    }
  }



  protected readonly environment = environment;
}