import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';
// bootstrap component
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ToastrModule } from 'ngx-toastr';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SharedModule } from './cyptolanding/shared/shared.module';

// Store
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

// Page Route
import { ExtrapagesModule } from './extrapages/extrapages.module';
import { LayoutsModule } from './layouts/layouts.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initFirebaseBackend } from './authUtils';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Auth
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { FakeBackendInterceptor } from './core/helpers/fake-backend';
import { rootReducer } from './store';
import { OrderEffects } from './store/orders/order.effects';
import { AuthenticationEffects } from './store/Authentication/authentication.effects';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { CartEffects } from './store/Cart/cart.effects';

import {authInterceptorProviders} from "./core/helpers/auth.interceptor";
import { environment } from 'src/environments/environment.prod';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({ declarations: [
        AppComponent,
        CyptolandingComponent,
    ],
    bootstrap: [AppComponent],
    imports: [BrowserModule,
        BrowserAnimationsModule,
        AngularFireAuthModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        LayoutsModule,
        AppRoutingModule,
        ExtrapagesModule,
        AccordionModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        SharedModule,
        ScrollToModule.forRoot(),
        SlickCarouselModule,
        ToastrModule.forRoot(),
        StoreModule.forRoot(rootReducer),
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
        }),
        EffectsModule.forRoot([
            OrderEffects,
            AuthenticationEffects,
            CartEffects,

        ])],
    providers: [
        authInterceptorProviders,
        // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        // { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
