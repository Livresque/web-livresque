import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { Store } from '@ngrx/store';
import { Register } from 'src/app/store/Authentication/authentication.actions';
import {ReusableFunctionService} from "../../../core/services/reusable-function.service";
import {ToastrService} from "ngx-toastr";
import {CrudService} from "../../../core/services/crud.service";
import {environment} from "../../../../environments/environment.prod";
import {take} from "rxjs";
import {UserRegister} from "../../../store/Authentication/auth.models";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {headersAuth} from "../../../core/services/constants";

const headers = new HttpHeaders({
  'Authorization': 'Token f47ac10b-58cc-4372-a567-0e02b2c3d479'
});

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],

})


export class SignupComponent implements OnInit {

  signupForm: UntypedFormGroup;
  submitted: boolean = false;
  error: string = '';
  successmsg: boolean = false;

  // set the current year
  year: number = new Date().getFullYear();

  // File Upload
  selectedFile: File | null = null;

  // Set user roles
  userRoles =
    [
      {"value": "super_admin", "label": "Super Admin"},
      {"value": "admin", "label": "Admin"},
      {"value": "admin_empolyees", "label": "Admin Employees"},
      {"value": "user", "label": "User"},
      {"value": "manager", "label": "Manager"},
      {"value": "partenaire", "label": "Partenaire"}
  ];
  // All user username and email
  userArrayUsername:string[] = []
  userArrayEmail:string[] = []
  usersEmailUsername: string[] = []

  constructor(
      private formBuilder: UntypedFormBuilder,
      public toastrService: ToastrService,
      public store: Store,
      public reusableFuction: ReusableFunctionService,
      private crudService: CrudService,
      private http: HttpClient
  ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      username: ['user10', [Validators.required, this.usernameValidator]],
      firstname: ['user1', Validators.required],
      lastname: ['user1', Validators.required],
      role: [null, Validators.required],
      email: ['user19@example.com', [Validators.required]],
      country: ['', [Validators.required]],
      password: ['user1@example.com', Validators.required],
    });


    this.crudService.fetchDataWithHeader(environment.api_url+'users', headersAuth)
        .subscribe((userItems: UserRegister[])=>{

          console.log(userItems)
          userItems.forEach(items=>{
            this.userArrayUsername.push(items.username)
            this.userArrayEmail.push(items.email)
          })
          this.usersEmailUsername = [...this.userArrayEmail, ...this.userArrayUsername]

    })

  }

  usernameValidator(control: any) {
    const pattern = /^[A-Za-z0-9]+$/;
    return pattern.test(control.value) ? null : { invalidUsername: true };
  }

  // Méthode pour filtrer les entrées
  onKeyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault(); // Empêche la saisie de caractères non valides
    }
  }

  // Convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  // Méthode pour récupérer le fichier sélectionné
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

    }
  }

  onSubmit() {
    this.submitted = true;
    this.signupForm.patchValue({
      role: 'client'
    });

    if (this.signupForm.valid ) {
      const userObject: UserRegister = {
        username: this.signupForm.get('username')?.value,
        firstname: this.signupForm.get('firstname')?.value,
        lastname: this.signupForm.get('lastname')?.value,
        role: this.signupForm.get('role')?.value,
        email: this.signupForm.get('email')?.value,
        country: this.signupForm.get('country')?.value,
        password: this.signupForm.get('password')?.value,
      };

      console.log(userObject)
      this.store.dispatch(Register({ user: userObject }));
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


  verifyIfUserInfoExit(event: any, whichInupt:string){
    const input = (event.target as HTMLInputElement).value;

    const type = whichInupt

    if (this.usersEmailUsername.includes(input)){
      if (type=="username"){
        console.log(type)
        this.toastrService.error("Ce nom d'utilisateur est déjà utilisé")

      }else if (type == "email"){
        console.log(type)
        this.toastrService.error("Cette addresse email est deja utilisé")
      }
    }

  }

}