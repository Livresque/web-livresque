import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap/alert';
// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { UIModule } from '../../shared/ui/ui.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { AuthRoutingModule } from './auth-routing';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
  declarations: [LoginComponent, SignupComponent, PasswordresetComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AlertModule.forRoot(),
        UIModule,
        AuthRoutingModule,
        SlickCarouselModule,
        NgSelectModule
    ]
})
export class AuthModule { }
