import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';

import { earningLineChart, salesAnalyticsDonutChart } from './data';
import { ChartType, ChatMessage } from './saas.model';
import { ConfigService } from '../../../core/services/config.service';

import { Store } from '@ngrx/store';
import {OrdersModel} from "../../../store/orders/order.model";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ReusableFunctionService} from "../../../core/services/reusable-function.service";
import {fetchEcoorderDataData} from "../../../store/orders/order.actions";

import {environment} from "../../../../environments/environment.prod";
import {selectOrderDetailData} from "../../../store/orders/order-selector";
import {CrudService} from "../../../core/services/crud.service";
import {TokenStorageService} from "../../../core/services/token-storage.service";
import { User } from 'src/app/store/Authentication/auth.models';
import {ConnectionTimerService} from "../../../core/services/connection-timer.service";
import {take} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {SellerStatistiqueInterface} from "../../../core/models/seller-statistique.interface";

@Component({
  selector: 'app-saas',
  templateUrl: './saas.component.html',
  styleUrls: ['./saas.component.scss']
})
/**
 * Saas-dashboard component
 */
export class SaasComponent implements OnInit, AfterViewInit {

  @ViewChild('scrollRef') scrollRef;
  transactions: any;
  statData: any;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  earningLineChart: ChartType;
  salesAnalyticsDonutChart: ChartType;
  ChatData: ChatMessage[];
  sassEarning: any;
  sassTopSelling: any;
  formData: UntypedFormGroup;

  //
  enditem: any
  modalRef?: BsModalRef;
  // masterSelected!: boolean;

  // Form submit
  chatSubmit: boolean;

  orderlist: OrdersModel[]
  Allorderlist: any
  detailsOrder: OrdersModel

  //
  term: any;
  //Currennt user
  currentUser!: User

  currentUserSellerStatistique!: SellerStatistiqueInterface

  constructor(
      public formBuilder: UntypedFormBuilder,
      private configService: ConfigService,
      public store: Store,
      public reusableFuction: ReusableFunctionService,
      public connectionTimerService: ConnectionTimerService,
      private crudService: CrudService,
      private tokenStorageService: TokenStorageService,
      private modalService: BsModalService,
      public toastrService: ToastrService,

  ) { }

  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Tableau de bord' }, { label: 'Saas', active: true }];

    this.connectionTimerService.getConnectionTime().pipe(take(1)).subscribe(time => {
      if (time) {
        this.toastrService.info("time");
      }
    });

    this._fetchData();

    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });

    this.configService.getConfig().subscribe(response => {
      this.sassEarning = response.sassEarning;
      this.sassTopSelling = response.sassTopSelling;

    });

    this.configService.getConfig().subscribe(data => {
      this.transactions = data.transactions;
      this.statData = data.statData;
    });

    if (this.tokenStorageService.getUser() && this.tokenStorageService.getUser().data.email.length > 2){
      this.currentUser = this.tokenStorageService.getUser()
      console.log(this.currentUser)
    }

    this.crudService.fetchDataOne(environment.api_url+'orders/seller/'+this.currentUser.data.user_id+'/')
        .subscribe((data: SellerStatistiqueInterface)=>{
          this.currentUserSellerStatistique = data
          console.log(data)
        })

  }

  /**
   * Save the message in chat
   */
  messageSave() {
    const message = this.formData.get('message').value;
    const currentDate = new Date();
    if (this.formData.valid && message) {
      // Message Push in Chat
      this.ChatData.push({
        align: 'right',
        name: 'Henry Wells',
        message,
        time: currentDate.getHours() + ':' + currentDate.getMinutes()
      });
      this.onListScroll();
      // Set Form Data Reset
      this.formData = this.formBuilder.group({
        message: null
      });
    }

    this.chatSubmit = true;
  }

  private _fetchData() {
    this.earningLineChart = earningLineChart;
    this.salesAnalyticsDonutChart = salesAnalyticsDonutChart;
  }

  ngAfterViewInit() {
    this.scrollRef.SimpleBar.getScrollElement().scrollTop = 500;
  }

  onListScroll() {
    if (this.scrollRef !== undefined) {
      setTimeout(() => {
        this.scrollRef.SimpleBar.getScrollElement().scrollTop =
          this.scrollRef.SimpleBar.getScrollElement().scrollHeight + 1500;
      }, 500);
    }
  }

  selectMonth(value: any) {
    let data = value.target.value
    switch (data) {
      case "january":
        this.sassEarning = [
          {
            name: "This month",
            amount: "$2007.35",
            revenue: "0.2",
            time: "From previous period",
            month: "Last month",
            previousamount: "$784.04",
            series: [
              {
                name: "series1",
                data: [22, 35, 20, 41, 51, 42, 49, 45, 58, 42, 75, 48],
              },
            ],
          },
        ];
        break;
      case "december":
        this.sassEarning = [
          {
            name: "This month",
            amount: "$2007.35",
            revenue: "0.2",
            time: "From previous period",
            month: "Last month",
            previousamount: "$784.04",
            series: [
              {
                name: "series1",
                data: [22, 28, 31, 34, 40, 52, 29, 45, 68, 60, 47, 12],
              },
            ],
          },
        ];
        break;
      case "november":
        this.sassEarning = [
          {
            name: "This month",
            amount: "$2887.35",
            revenue: "0.4",
            time: "From previous period",
            month: "Last month",
            previousamount: "$684.04",
            series: [
              {
                name: "series1",
                data: [28, 30, 48, 50, 47, 40, 35, 48, 56, 42, 65, 41],
              },
            ],
          },
        ];
        break;
      case "october":
        this.sassEarning = [
          {
            name: "This month",
            amount: "$2100.35",
            revenue: "0.4",
            time: "From previous period",
            month: "Last month",
            previousamount: "$674.04",
            series: [
              {
                name: "series1",
                data: [28, 48, 39, 47, 48, 41, 28, 46, 25, 32, 24, 28],
              },
            ],
          },
        ];
        break;
    }
  }

  sellingProduct(event) {
    let month = event.target.value;
    switch (month) {
      case "january":
        this.sassTopSelling = [
          {
            title: "Boutique B",
            amount: "$ 7842",
            revenue: "0.4",
            list: [
              {
                 title: "Boutique D",
                text: "Neque quis est",
                sales: 41,
                chartVariant: "#34c38f"
              },
              {
                 title: "Boutique E",
                text: "Quis autem iure",
                sales: 14,
                chartVariant: "#556ee6"
              },
              {
                 title: "Boutique F",
                text: "Sed aliquam mauris.",
                sales: 85,
                chartVariant: "#f46a6a"
              },
            ],
          },
        ];
        break;
      case "december":
        this.sassTopSelling = [
          {
            title: "Boutique A",
            amount: "$ 6385",
            revenue: "0.6",
            list: [
              {
                 title: "Boutique A",
                text: "Neque quis est",
                sales: 37,
                chartVariant: "#556ee6"
              },
              {
                 title: "Boutique B",
                text: "Quis autem iure",
                sales: 72,
                chartVariant: "#f46a6a"
              },
              {
                 title: "Boutique C",
                text: "Sed aliquam mauris.",
                sales: 54,
                chartVariant: "#34c38f"
              },
            ],
          },
        ];
        break;
      case "november":
        this.sassTopSelling = [
          {
            title: "Boutique C",
            amount: "$ 4745",
            revenue: "0.8",
            list: [
              {
                 title: "Boutique G",
                text: "Neque quis est",
                sales: 37,
                chartVariant: "#34c38f"
              },
              {
                 title: "Boutique H",
                text: "Quis autem iure",
                sales: 42,
                chartVariant: "#556ee6"
              },
              {
                 title: "Boutique I",
                text: "Sed aliquam mauris.",
                sales: 63,
                chartVariant: "#f46a6a"
              },
            ],
          },
        ];
        break;
      case "october":
        this.sassTopSelling = [
          {
            title: "Boutique A",
            amount: "$ 6385",
            revenue: "0.6",
            list: [
              {
                 title: "Boutique A",
                text: "Neque quis est",
                sales: 37,
                chartVariant: "#f46a6a"
              },
              {
                 title: "Boutique B",
                text: "Quis autem iure",
                sales: 72,
                chartVariant: "#556ee6"
              },
              {
                 title: "Boutique C",
                text: "Sed aliquam mauris.",
                sales: 54,
                chartVariant: "#34c38f"
              },
            ],
          },
        ];
        break;
      default:
        this.sassTopSelling = [
          {
            title: "Boutique A",
            amount: "$ 6385",
            revenue: "0.6",
            list: [
              {
                 title: "Boutique A",
                text: "Neque quis est",
                sales: 37,
                chartVariant: "#556ee6"
              },
              {
                 title: "Boutique B",
                text: "Quis autem iure",
                sales: 72,
                chartVariant: "#34c38f"
              },
              {
                 title: "Boutique C",
                text: "Sed aliquam mauris.",
                sales: 54,
                chartVariant: "#f46a6a"
              }
            ]
          }
        ];
        break;
    }
  }

  //Refresh
  // refreshOderData(){
  //   this.store.dispatch(fetchEcoorderDataData());
  //   this.store.select(selectData).subscribe((data: OrdersModel[]) => {
  //     console.log(data)
  //     this.orderlist = data;
  //     this.Allorderlist = data;
  //   });
  //
  //   //Chargement de la liste des livreurs dans le select
  //   this.store.dispatch(fetchDeliveryData())
  //   this.store.select(selectDataDelivery).subscribe(data => {
  //     if (data) {
  //       //Je recupere dans un premier temps le tableau de tout les livreurs
  //       //Puis j'extraire la liste des surnames de chaque livreur dans le
  //       //this.selectValue
  //       this.listDeliveryData = data;
  //     }
  //   });
  //
  // }

  //
  showDetailsOrder(orderIdDetail: string) {
    // Réinitialiser `deliveryselectValue` avant d'ajouter les nouveaux livreurs
    // console.log(orderIdDetail)
    this.crudService.fetchData(environment.api_url+`order-retrieve/${orderIdDetail}`)
        .subscribe((data: any)=>{
          if (data) {
            this.detailsOrder = data;

          }
        })

    // Déclenche l'action pour récupérer les détails de la commande
    // this.store.dispatch(fetchEcoDetailIdData({ orderIdDetail }));

    console.log("Console de NGRX ==========================================")
    this.store.select(selectOrderDetailData).subscribe((detailOrderId: OrdersModel | null) => {
      if (detailOrderId) {
        this.detailsOrder = detailOrderId;

      }
    });
  }

  //
  openViewModal(content: any) {
    this.modalRef = this.modalService.show(content);
  }

  searchOrder() {
    if (this.term) {
      this.orderlist = this.Allorderlist.filter((data: any) => {
        return data.name.toLowerCase().includes(this.term.toLowerCase())
      })
    } else {
      this.orderlist = this.Allorderlist
    }
  }

  //Date customisable
  beginDate(date: any){
    return this.reusableFuction.separateDateAndTime(date)
  }

  //Click for refresh Data
  isSuccess = false;
  onButtonClick() {
    this.isSuccess = true;
    // Revenir à la classe dark après 3 secondes
    setTimeout(() => {
      this.isSuccess = false;
    }, 5000); // 3000 millisecondes = 3 secondes

  }


  //pagination
  pagechanged(event: any) {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.enditem = event.page * event.itemsPerPage;
    this.orderlist = this.orderlist.slice(startItem, this.enditem)
  }
}
