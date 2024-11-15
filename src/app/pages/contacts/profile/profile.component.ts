import { Component, OnInit } from '@angular/core';

import { revenueBarChart } from './data';

import { ChartType } from './profile.model';
import {UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators} from "@angular/forms";
import {environment} from "../../../../environments/environment.prod";
import {User, UserData} from "../../../store/Authentication/auth.models";
import {Register} from "../../../store/Authentication/authentication.actions";
import {ToastrService} from "ngx-toastr";
import {Store} from "@ngrx/store";
import {ReusableFunctionService} from "../../../core/services/reusable-function.service";
import {CrudService} from "../../../core/services/crud.service";
import {Router} from "@angular/router";
import {ConnectionTimerService} from "../../../core/services/connection-timer.service";
import {take} from "rxjs";
import {HttpHeaders} from "@angular/common/http";
import {TokenStorageService} from "../../../core/services/token-storage.service";

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

  //Headers
  userConnectedHeader!: HttpHeaders
  
  // Profil
  profile_picture: File[] = [];
  
  constructor(
      private formBuilder: UntypedFormBuilder,
      public toastrService: ToastrService,
      public store: Store,
      public reusableFuction: ReusableFunctionService,
      private crudService: CrudService,
      private tokenStorage: TokenStorageService,
      private route: Router,
      public connectionTimerService: ConnectionTimerService,
      public toastr:ToastrService,

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

    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required]],
       about: [''],
      country: ['', Validators.required],
    });

    this.userConnectedHeader = new HttpHeaders({
      'Authorization': `Token ${this.tokenStorage.getRefreshToken()}`
    })




    this.crudService.fetchDataOne(environment.api_url+'users/')
        .subscribe((userItems: User)=>{
          const userItemsData:any = userItems.data

          console.log(userItems)
         if (userItems){
           userItemsData.map(items=>{
             this.userArrayUsername.push(items.username)
             this.userArrayEmail.push(items.email)
           })
           this.usersEmailUsername = [...this.userArrayEmail, ...this.userArrayUsername]
         }
        })

    if (this.tokenStorage.getUser() && this.tokenStorage.getUser().data?.email.length > 2){
      this.currentUser = this.tokenStorage.getUser();
      if (this.currentUser) {
        console.log(this.currentUser)
        this.signupForm.patchValue({
          username: this.currentUser?.data.username,
          firstname: this.currentUser?.data.firstname,
          lastname: this.currentUser?.data.lastname,
          email: this.currentUser?.data.email,
          about: this.currentUser?.data.about,
          country: this.currentUser?.data.country,
        });
      }
    }

    // fetches the data
    this._fetchData();
  }


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
  
  profileImageUploadSuccess(event: any) {
    const file = event.target?.files?.[0]; // Récupère le fichier depuis l'événement

    if (file instanceof Blob && file.type.match(/^image\/(jpeg|png)$/)) { // Vérifie le type du fichier
      this.profile_picture = [file as File]; // Remplace l'image de profil par le nouveau fichier
    } else {
      this.toastr.warning("Le fichier fourni n'est pas valide ! Veuillez sélectionner une image JPEG ou PNG.");
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.signupForm.valid ) {
      const formData = new FormData();
      formData.append('firstname', this.signupForm.get('firstname').value.trim().toLowerCase());
      formData.append('lastname', this.signupForm.get('lastname').value.trim().toLowerCase());
      formData.append('email', this.signupForm.get('email').value.trim().toLowerCase());
      formData.append('about', this.signupForm.get('about').value.trim().toLowerCase());
      formData.append('country', this.signupForm.get('country').value.trim().toLowerCase());
      if (this.profile_picture.length > 0) {
        formData.append('profile', this.profile_picture[0]);
      }

      formData.forEach((value, key) => {
        console.log(key, value)
      })

      this.crudService.updateDataOneWithHeader(
          environment.api_url + 'users/'+this.currentUser.data.user_id+'/',
          formData,
          this.userConnectedHeader)
          .pipe(take(1))
          .subscribe(data => {
            this.toastr.success("Produit ajouté avec succès !");
            setTimeout(()=>{
              location.reload();
            }, 1500)
          }, error => {
            this.toastr.error("Une erreur est survenue lors de la mise a jour des elements!");
            console.log(error)
          });

    } else {
      console.log("Erreur lors de la soumission");
      Object.keys(this.signupForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.signupForm.get(key)?.errors;
        this.signupForm.controls[key].markAsTouched();
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
