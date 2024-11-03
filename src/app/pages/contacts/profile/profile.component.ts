import { Component, OnInit } from '@angular/core';

import { revenueBarChart } from './data';

import { ChartType } from './profile.model';
import {UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators} from "@angular/forms";
import {environment} from "../../../../environments/environment.prod";
import {User, UserRegister} from "../../../store/Authentication/auth.models";
import {Register} from "../../../store/Authentication/authentication.actions";
import {ToastrService} from "ngx-toastr";
import {Store} from "@ngrx/store";
import {ReusableFunctionService} from "../../../core/services/reusable-function.service";
import {CrudService} from "../../../core/services/crud.service";
import {TokenStorageService} from "../../../core/services/token-storage.service";
import {Router} from "@angular/router";
import {ConnectionTimerService} from "../../../core/services/connection-timer.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

/**
 * Contacts-profile component
 */
export class ProfileComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  revenueBarChart: ChartType;
  statData:any;

  //Form variable
  signupForm: UntypedFormGroup;
  submitted: boolean = false;
  error: string = '';
  successmsg: boolean = false;

  // set the current year
  year: number = new Date().getFullYear();

  // File Upload
  imageURL: string | undefined;

  // Set user roles
  userRoles = [
    { value: 'user', label: 'User' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Admin' },
    { value: 'partenaire', label: 'Partenaire' }
  ];
  // All user username and email
  userArrayUsername:string[] = []
  userArrayEmail:string[] = []
  usersEmailUsername: string[] = []

  //Current User
  currentUser!: User

  //Timer connexion
  connectionTime: Date | null = null;
  connectionDuration: Date | null = null;

  constructor(
      private formBuilder: UntypedFormBuilder,
      public toastrService: ToastrService,
      public store: Store,
      public reusableFuction: ReusableFunctionService,
      private crudService: CrudService,
      private tokenStorageService: TokenStorageService,
      private route: Router,
      public connectionTimerService: ConnectionTimerService,
  ) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'Profile', active: true }];

    // Timer
    // On récupère l'heure de connexion via le service
      this.connectionTimerService.getConnectionTime().subscribe(time => {
        this.connectionTime = time;
      });

      // Calcul de la durée de connexion à chaque appel
      this.connectionDuration = this.connectionTimerService.getConnectionDuration();

    //form
    this.signupForm = this.formBuilder.group({
      username: [''],
      first_name: [''],
      last_name: [''],
      email: [''],
      adresse: [''],
      password: ['' ],
      about_us: ['' ],
      profile_picture: [null],
    });


    this.crudService.fetchData(environment.api_url+'users/')
        .subscribe((userItems: UserRegister[])=>{
          userItems.forEach(items=>{
            this.userArrayUsername.push(items.username)
            this.userArrayEmail.push(items.email)
          })
          this.usersEmailUsername = [...this.userArrayEmail, ...this.userArrayUsername]
        })

    if (this.tokenStorageService.getUser() && this.tokenStorageService.getUser().email.length > 2){
      this.currentUser = this.tokenStorageService.getUser()

      console.log(this.currentUser)
      if (this.currentUser) {
        this.signupForm.patchValue({
          username: this.currentUser.username,
          first_name: this.currentUser.first_name,
          last_name: this.currentUser.last_name,
          email: this.currentUser.email,
          adresse: this.currentUser.adresse,
          about_us: this.currentUser.about_us,
        });
      }
    }

    // fetches the data
    this._fetchData();
  }

  /**
   * Fetches the data
   */
  private _fetchData() {
    this.revenueBarChart = revenueBarChart;
    // this.statData = statData;
  }

  // Convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  fileChange(event: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      // Stockez l'image encodée en base64 dans le champ du formulaire
      this.signupForm.controls['profile_picture'].setValue(this.imageURL);
    };
    reader.readAsDataURL(file);
  }


  verifyIfUserInfoExit(event: any, whichInupt:string){
    const input = (event.target as HTMLInputElement).value;
    if (this.usersEmailUsername.includes(input)){
      if (whichInupt==="email"){
        this.toastrService.error("Cette addresse email est deja utilisé. Si elle vous appartient connecter vous.")
      }else if (whichInupt === 'username'){
        this.toastrService.error("Ce nom d'utilisateur est déjà utilisé")
      }
    }

  }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;

    if (this.signupForm.valid) {
      // Récupérer toutes les données du formulaire
      const userRegister = this.signupForm.value;

      if (this.signupForm.get('profile_picture').value == null){
        delete userRegister['profile_picture'];
      }

      this.crudService.patchData(environment.api_url+'user/update/',userRegister).subscribe(m=>{
        this.toastrService.success("Modification effectuer avec succè. Vous serez déconnecter pour une nouvelle connexion.")

        setTimeout(()=>{
          this.route.navigate(['auth/login'])
        }, 2000)
      }, error1 => {
        this.toastrService.error("Une erreur est survenue. Veuillez contacter le support")
        return;
      })

    } else {
      console.log("Formulaire invalid")
      // Parcourir et afficher les erreurs du formulaire
      Object.keys(this.signupForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.signupForm.get(key)?.errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            const errorMessage = this.reusableFuction.getErrorMessage(key, controlErrors);
            console.log(errorMessage);
            this.toastrService.error(errorMessage, 'Erreur');
          });
        }
      });
    }
  }

  protected readonly environment = environment;
}
