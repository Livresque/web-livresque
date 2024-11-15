import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {CrudService} from "../../core/services/crud.service";
import {environment} from "../../../environments/environment.prod";
import {take} from "rxjs";
import {Route, Router} from "@angular/router";

@Component({
  selector: 'app-steptwoverification',
  templateUrl: './steptwoverification.component.html',
  styleUrls: ['./steptwoverification.component.scss']
})
export class SteptwoverificationComponent implements OnInit {

  userForm!: FormGroup;
  isSubmitted = false;

  constructor(
      private formBuilder: FormBuilder,
      public toastService: ToastrService,
      public crudService: CrudService,
      public router: Router
  ) { }
  config: any = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '80px',
      'height': '50px'
    }
  };
  ngOnInit(): void {
    document.body.classList.remove('auth-body-bg');
    // Initialisation du formulaire réactif
    this.userForm = this.formBuilder.group({
      lastname: ['', Validators.required], // Champ Prénom avec validation requise
      otp: ['', Validators.required] // OTP avec validation
    });

    this.toastService.info("Vous avez 5min pour soumettre ce formulaire. Au dela veuillez lancer une nouvelle procedure de modification de votre mot de passe")
  }
  // set the currenr year
  year: number = new Date().getFullYear();


  // Getter pour accéder facilement aux contrôles du formulaire dans le template
  get formControls() {
    return this.userForm.controls;
  }

  // Méthode soumise à la validation du formulaire
  onSubmit() {
    this.isSubmitted = true;

    if (this.userForm.valid) {
      // Formulaire valide, traitement ici
      console.log(this.userForm.value);

      this.crudService.addData(environment.api_url+"password-valid-reset", this.userForm.value)
          .pipe(take(1)).subscribe((data: any)=>{
            this.toastService.success(data.detail);

            setTimeout(()=>{
              this.router.navigate(['/auth/login']);
            }, 1000)
      }, error => {
        this.toastService.error(error.detail);
      })

    } else {
      // Gérer les erreurs de validation
      console.log('Formulaire invalide');
    }
  }

  // Méthode pour gérer l'OTP entré
  optHandler(otpValue: string) {
    console.log('OTP reçu: ', otpValue);
    this.userForm.patchValue({ otp: otpValue });
  }
}
