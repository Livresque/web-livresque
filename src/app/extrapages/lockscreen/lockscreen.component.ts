import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from "../../core/services/token-storage.service";
import { User } from 'src/app/store/Authentication/auth.models';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../core/services/auth.service";
import {login} from "../../store/Authentication/authentication.actions";
import {Store} from "@ngrx/store";
import {environment} from "../../../environments/environment.prod";

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.scss']
})

/**
 * Lock-screen component
 */
export class LockscreenComponent implements OnInit {

  // set the currenr year
  year: number = new Date().getFullYear();

  //User in Storage
  userStorage: User

  //curent password
  currentPassword: string = ""

  constructor(
      private localTokenStorage: TokenStorageService,
      public toastService: ToastrService,
      public router: Router,
      private store: Store
  ) { }

  ngOnInit(): void {
    if (this.localTokenStorage.getUser() && this.localTokenStorage.getUser().data.email !=''){
      this.userStorage = this.localTokenStorage.getUser();
    }else {
      this.toastService.error('Impossible de recuperer vos identifiants de connexion. Reconnecter vous', "Erreur de chargement");
      setTimeout(()=>{
        this.router.navigate(['/auth/login']);
      }, 2000)
    }
  }

  unloock(){
    // console.log(this.userStorage.)
    if (this.currentPassword.length > 0){
      this.store.dispatch(login({ email: this.userStorage.data.email, password: this.currentPassword.trim() }));

    }else {
      this.toastService.error("Saissez votre mot de passe");
    }
  }

    protected readonly environment = environment;
}
