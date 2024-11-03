import {Component, OnInit, ViewChild} from '@angular/core';
import {firstValueFrom, lastValueFrom, Observable, Subject, take} from 'rxjs';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormGroup, FormArray, Validators } from '@angular/forms';

// Date Format
import { DatePipe } from '@angular/common';

import {selectData, selectOrderDetailData} from 'src/app/store/orders/order-selector';
import {
  addEcoOrders,
  deleteEcoOrders, fetchEcoDetailIdData,
  fetchEcoDetailIdDataSuccess,
  fetchEcoorderDataData,
  updateEcoOrders
} from 'src/app/store/orders/order.actions';
import {select, Store} from '@ngrx/store';
import {HttpClient} from "@angular/common/http";
import {OrdersModel} from "../../../store/orders/order.model";
import {ReusableFunctionService} from "../../../core/services/reusable-function.service";
import {selectDataDelivery} from "../../../store/delivery/delivery-selector";
import {fetchDeliveryData} from "../../../store/delivery/delivery.action";
import {DeliveryModel} from "../../../store/delivery/delivery.model";
import {environment} from "../../../../environments/environment.prod";
import {CrudService} from "../../../core/services/crud.service";
import {ToastrService} from "ngx-toastr";

//Format to update Order delivery
// export interface  updateOrderDelivery {
//    order_id: string,
//   surname: string[]
// }


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})

/**
 * Ecommerce orders component
 */
export class OrdersComponent {
  enditem: any
  modalRef?: BsModalRef;
  masterSelected!: boolean;
  // bread crumb items
  breadCrumbItems: Array<{}>;
  term: any;
  orderlist: OrdersModel[]
  ordersForm!: UntypedFormGroup;
  submitted = false;
  content?: any;
  orderes?: any;
  total: Observable<number>;
  page: any = 1;
  deletId: any;
  Allorderlist: any
  @ViewChild('showModal', { static: false }) showModal?: ModalDirective;
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;

  selectValue: string[];
  detailsOrder: OrdersModel

  listDeliveryData: DeliveryModel[];
  deliveryselectValue:string[] = []

  newDeliveryData:any
  activeSaveDelivery = false;
  oldValueDeliverySelectValue:string[] = [];

  constructor(
      private modalService: BsModalService,
      private formBuilder: UntypedFormBuilder,
      private datePipe: DatePipe,
      private store: Store,
      public http: HttpClient,
      public reusableFuction: ReusableFunctionService,
      private CrudService: CrudService,
      public toastr:ToastrService
  ) {
  }


  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Commande(s)', active: true }];
    /**
     * Form Validation
     */
    this.ordersForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      date: ['', [Validators.required]],
      total: ['', [Validators.required]],
      status: ['', [Validators.required]],
      payment: ['', [Validators.required]]
    });

    // fetch Oder data and refresh
    this.refreshOderData();

    this.deliveryselectValue = [];
    // this.newTabeDataDelivery = [];

  }

  refreshOderData(){
    this.store.dispatch(fetchEcoorderDataData());
    this.store.select(selectData).subscribe((data: OrdersModel[]) => {
      console.log(data)
      this.orderlist = data;
      this.Allorderlist = data;
    });

    //Chargement de la liste des livreurs dans le select
    this.store.dispatch(fetchDeliveryData())
    this.store.select(selectDataDelivery).subscribe(data => {
      if (data) {
        //Je recupere dans un premier temps le tableau de tout les livreurs
        //Puis j'extraire la liste des surnames de chaque livreur dans le
        //this.selectValue
        this.listDeliveryData = data;
        // Réinitialiser le tableau avant de le remplir
        this.selectValue = [];
        this.listDeliveryData.forEach(deliverySurname => {
          if (deliverySurname.is_available==="Disponible"){
            this.selectValue.push(deliverySurname.surname.toString().trim());
          }
        });
      }
    });

  }

  isSuccess = false;
  onButtonClick() {
    this.isSuccess = true;
    // Revenir à la classe dark après 3 secondes
    setTimeout(() => {
      this.isSuccess = false;
    }, 5000); // 3000 millisecondes = 3 secondes

  }


  dectecDeliveryChanged() {
    const compareUnorderedFunc = (a: string[], b: string[]): boolean => {
      // Vérifier si les deux tableaux ont la même longueur
      if (a.length !== b.length) return false;

      // Convertir les tableaux en Set pour ignorer l'ordre des éléments
      const setA = new Set(a);
      const setB = new Set(b);

      // Comparer les Sets
      return setA.size === setB.size && [...setA].every(value => setB.has(value));
    };

    console.log("dectecDeliveryChanged()");
    console.log(this.deliveryselectValue);

    const areEqual = compareUnorderedFunc(this.oldValueDeliverySelectValue, this.deliveryselectValue);
    console.log("Les deux tableaux sont-ils identiques ?", areEqual);

    this.activeSaveDelivery = areEqual ;

    console.log("Old Value")
    console.log(this.oldValueDeliverySelectValue)

    console.log("Changed Value")
    console.log(this.deliveryselectValue)
  }


  saveDeliverySelected(){
    this.newDeliveryData = {
      order_id: this.detailsOrder.order_id,
      surname: []
    };

    this.deliveryselectValue.forEach(deliverySelectArray=>{
      this.newDeliveryData.surname.push(deliverySelectArray)
    })


    setTimeout(()=>{
      console.log(this.newDeliveryData)
      this.CrudService.addData(
          environment.api_url+'assign-order-delivery/',
          [this.newDeliveryData]
      ).subscribe((result: any)=>{
        this.toastr.success("Livreur mise a jour", 'Succès');
        this.deliveryselectValue = [];
        this.deliveryselectValue.push(this.newDeliveryData.surname);
        },error => {
        this.toastr.error("Erreur lors de la Livreur mise a jour du livreur", 'Succès');
      })

    }, 500)
  }


  /**
   * Open modal
   * @param orderIdDetail for get Order Detail
   */

  // showDetailsOrder(orderIdDetail: any){
  //   this.store.dispatch(fetchEcoDetailIdData({ orderIdDetail: orderIdDetail }));
  //
  //   this.store.select(selectOrderDetailData).pipe(take(1)).subscribe((data: OrdersModel)=>{
  //     // console.log(data)
  //     setTimeout(()=>{
  //       this.detailsOrder = data
  //     }, 1000)
  //     console.log(this.detailsOrder);
  //   })
  // }


  showDetailsOrder(orderIdDetail: string) {
    // Réinitialiser `deliveryselectValue` avant d'ajouter les nouveaux livreurs
    // console.log(orderIdDetail)
    this.CrudService.fetchData(environment.api_url+`order-retrieve/${orderIdDetail}`)
        .subscribe((data: any)=>{
          if (data) {
            this.detailsOrder = data;
            // Vérifier si `livreur` existe et est un tableau avec des éléments
            if (data.livreur && data.livreur.length > 0) {

              setTimeout(() => {
                this.deliveryselectValue = [];  // Initialise une fois avant le forEach
                data.livreur.forEach(deliverySurnameOrder => {
                  console.log("Les livreurs");
                  console.log(deliverySurnameOrder.surname);

                  // Ajoute chaque élément à deliveryselectValue sans le réinitialiser
                  this.deliveryselectValue.push(deliverySurnameOrder.surname.toString());
                });

                // Sauvegarde la valeur après avoir rempli le tableau
                this.oldValueDeliverySelectValue = [...this.deliveryselectValue];
                this.dectecDeliveryChanged();  // Détection après la boucle

              }, 1000);

            } else {
              // S'assurer que la sélection est vide si aucun livreur n'est disponible
              this.deliveryselectValue = [];
              // alert("Vide")    ;
            }
          }
        })

    // Déclenche l'action pour récupérer les détails de la commande
    // this.store.dispatch(fetchEcoDetailIdData({ orderIdDetail }));

    console.log("Console de NGRX ==========================================")
    this.store.select(selectOrderDetailData).subscribe((detailOrderId: OrdersModel | null) => {
      if (detailOrderId) {
        this.detailsOrder = detailOrderId;
        // Vérifier si `livreur` existe et est un tableau avec des éléments
        if (detailOrderId.livreur && detailOrderId.livreur.length > 0) {
          setTimeout(()=>{
            detailOrderId.livreur.forEach(deliverySurnameOrder => {
              console.log("Les livreurs");
              this.deliveryselectValue = []
              this.deliveryselectValue.push(deliverySurnameOrder.surname.toString())
              this.oldValueDeliverySelectValue = this.deliveryselectValue;
              this.dectecDeliveryChanged();
            }, 1000)
          })
        } else {
          // S'assurer que la sélection est vide si aucun livreur n'est disponible
          this.deliveryselectValue = [];
          alert("Vide")    ;
        }
      }
    });
  }




/**
   * Open modal
   * @param content modal content
   */
  openViewModal(content: any) {
    this.modalRef = this.modalService.show(content);
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll(ev: any) {
    this.orderes.forEach((x: { state: any; }) => x.state = ev.target.checked)
  }

  checkedValGet: any[] = [];
  // Delete Data
  deleteData(id: any) {
    if (id) {
      document.getElementById('lj_' + id)?.remove();
    }
    else {
      this.checkedValGet.forEach((item: any) => {
        document.getElementById('lj_' + item)?.remove();
      });
    }
  }

  // Delete Data
  confirm(id: any) {
    this.deletId = id
    this.removeItemModal.show();
  }
  // delete order
  deleteOrder() {
    this.store.dispatch(deleteEcoOrders({ ids: this.deletId }));
    this.removeItemModal.hide();
  }

  // fiter job
  searchOrder() {
    if (this.term) {
      this.orderlist = this.Allorderlist.filter((data: any) => {
        return data.name.toLowerCase().includes(this.term.toLowerCase())
      })
    } else {
      this.orderlist = this.Allorderlist
    }
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.modalRef = this.modalService.show(content, { class: 'modal-md' });
  }
  /**
   * Form data get
   */
  get form() {
    return this.ordersForm.controls;
  }

  /**
  * Save user
  */
  saveUser() {
    if (this.ordersForm.valid) {
      if (this.ordersForm.get('id')?.value) {
        const updatedData = this.ordersForm.value;
        this.store.dispatch(updateEcoOrders({ updatedData }));
      } else {
        this.ordersForm.controls['id'].setValue(this.orderlist.length + 1)
        const currentDate = new Date();
        const formattedDate = this.datePipe.transform(currentDate, 'yyyy-mm-dd');
        this.ordersForm.controls['date'].setValue(formattedDate);
        const newData = this.ordersForm.value;
        this.store.dispatch(addEcoOrders({ newData }))
      }
      this.showModal?.hide()

      setTimeout(() => {
        this.ordersForm.reset();
      }, 0);
      this.submitted = true
    }
  }
  /**
   * Open Edit modal
   * @param content modal content
   */
  editModal(id: any) {
    this.submitted = false;
    this.showModal?.show()
    var modelTitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modelTitle.innerHTML = 'Edit Order';
    var updateBtn = document.getElementById('addNewOrder-btn') as HTMLAreaElement;
    updateBtn.innerHTML = "Update";
    this.ordersForm.patchValue(this.orderlist[id])
  }

  // pagination
  pagechanged(event: any) {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.enditem = event.page * event.itemsPerPage;
    this.orderlist = this.orderlist.slice(startItem, this.enditem)
  }

  beginDate(date: any){
    return this.reusableFuction.separateDateAndTime(date)
  }
}
