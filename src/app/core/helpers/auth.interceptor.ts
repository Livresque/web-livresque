import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { TokenStorageService } from '../services/token-storage.service';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment.prod";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenStorage: TokenStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authUrls = [
      environment.api_url + 'users/create/',
      environment.api_url + 'users/login/',
      environment.api_url + 'orders/', // URL spécifique
      environment.api_url + 'users/',
    ];

    const refreshToken = this.tokenStorage.getRefreshToken();
    let authReq = req;

    console.log('Liste des URLs nécessitant un token:', authUrls);
    console.log('URL de la requête interceptée :', req.url);
    console.log('Refresh Token:', refreshToken);

    if (refreshToken) {
      console.log('Refresh Token récupéré :', refreshToken);

      // Vérifie si l'URL correspond strictement à '/orders/'
      if (req.url === environment.api_url + 'orders/') {
        authReq = req.clone({
          setHeaders: {
            'Authorization': `Token ${refreshToken}`, // Ajoute le token dans l'en-tête
          },
        });

        console.log('En-tête Authorization après clonage:', authReq.headers.get('Authorization'));
      }
    }

    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
