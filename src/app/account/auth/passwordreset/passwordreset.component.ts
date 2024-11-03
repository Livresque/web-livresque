import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import {ReusableFunctionService} from "../../../core/services/reusable-function.service";
import {take} from "rxjs";
import {HttpResponse} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {TokenStorageService} from "../../../core/services/token-storage.service";

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})

/**
 * Reset-password component
 */
export class PasswordresetComponent implements OnInit, AfterViewInit {

  resetForm: UntypedFormGroup;
  submitted: any = false;
  error: any = '';
  success: any = '';
  loading: any = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(
      private formBuilder: UntypedFormBuilder,
      private tokenStorage: TokenStorageService,
      private router: Router,
      private authenticationService: AuthenticationService,
      public toastrService:ToastrService


  ) { }

  ngOnInit() {

    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit() {
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.success = '';
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }else{
      this.authenticationService.resetPassword(this.f.email.value).pipe(take(1)).subscribe((reponse: any)=>{
        this.toastrService.success(reponse.detail);

        setTimeout(()=>{
          this.router.navigate(['pages/two-step-verification'])
        })
      }, error1 => {
        this.toastrService.success("Une erreur est survenu. Contacter l'administrateur systeme !")
      })
    }

  }


}
