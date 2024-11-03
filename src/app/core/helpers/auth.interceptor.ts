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
        environment.api_url + 'user-detail/',
      environment.api_url + 'user/update/',
      environment.api_url + 'users/create/',
      environment.api_url + 'users/login/',
    ];
    const refreshToken = this.tokenStorage.getRefreshToken();
    let authReq = req;

    // Log pour vérifier les URLs
    console.log('Liste des URLs nécessitant un token:', authUrls);
    console.log('URL de la requête interceptée :', req.url);

    if (refreshToken) {
      console.log('Refresh Token récupéré :', refreshToken);

      // Vérifie si l'URL correspond à une URL qui nécessite un token
      if (authUrls.some(url => req.url.includes(url))) {
        // Clonage de la requête avec l'ajout de l'en-tête Authorization
        authReq = req.clone({
          setHeaders: {
            // 'Authorization': `toe ${refreshToken}` // Ajoute le token dans l'en-tête
            'Authorization': `Token f47ac10b-58cc-4372-a567-0e02b2c3d479` // Ajoute le token dans l'en-tête
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
