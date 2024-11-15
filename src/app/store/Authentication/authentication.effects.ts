import { Injectable, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, exhaustMap, tap, first } from 'rxjs/operators';
import {from, of, take} from 'rxjs';
import { AuthenticationService } from '../../core/services/auth.service';
import { login, loginSuccess, loginFailure, logout, logoutSuccess, Register, RegisterSuccess, RegisterFailure } from './authentication.actions';
import { Router } from '@angular/router';
import { UserProfileService } from 'src/app/core/services/user.service';
import {ToastrService} from "ngx-toastr";
import {TokenStorageService} from "../../core/services/token-storage.service";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable()
export class AuthenticationEffects {

    constructor(
        @Inject(Actions) private actions$: Actions,
        private AuthenticationService: AuthenticationService,
        private userService: UserProfileService,
        public toastService: ToastrService,
        public tokenStorage: TokenStorageService,
        private router: Router
    ) { }
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(login), // Écouter l'action "login"
            exhaustMap(({ email, password }) =>
                this.AuthenticationService.login(email, password).pipe(
                    switchMap((response: any) => {
                        // Vérifier si les tokens existent dans la réponse
                        if (response.token) {

                            // Stocker les tokens dans le localStorage
                            const user = {
                                id: response.id,
                                accessToken: response.token,
                                refreshToken: response.token,
                            };

                            this.tokenStorage.saveRefreshToken(user.accessToken);

                            // Récupérer les détails de l'utilisateur
                            return this.userService.getDetailUser(user.id).pipe(
                                map((dataUser: any) => {
                                    // Si l'utilisateur est trouvé, dispatch "loginSuccess"
                                    if (dataUser) {
                                        this.tokenStorage.saveUser(dataUser);
                                        this.router.navigate(['/']);
                                        return loginSuccess({ user: dataUser });
                                    }
                                    return loginFailure({ error: 'Détails de l’utilisateur introuvables' });
                                }),
                                catchError((error) => of(loginFailure({ error: error})))
                            );
                        } else {
                            // Gérer le cas où les tokens sont manquants
                            this.toastService.error("Les informations de connexion sont incorrectes.", "Erreur de connexion");
                            return of(loginFailure({ error: 'Tokens manquants dans la réponse' }));
                        }
                    }),
                    catchError((error: HttpErrorResponse) =>
                        {
                            if (error.status==404){
                                this.toastService.error("Impossible de vous authentifier. Connecter vous a nous. Merci");
                            }else if (error.status==400){
                                this.toastService.error("Votre mot de passe est incorrect. Reesayer s'il vous plait");
                            }else if (error.status==403){
                                this.toastService.error("Votre compte a ete desactiver. Merci de contacter l'administrateur!");
                            }else{
                                this.toastService.error("Un probleme est survenue. Merci de contacter l'administrateur!");
                            }
                            return of(loginFailure({ error: error.message }))
                        }
                    )
                )
            )
        )
    );

    register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(Register),
            exhaustMap(({ user }) => {
                console.log('user:', user); // Ajoutez ceci pour voir le contenu de user
                if (!user || !user.email) {
                    return of(RegisterFailure({ error: 'Invalid user data' }));
                }

                console.log(user)

                return this.AuthenticationService.register({
                    email: user.email,
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    role: user.role,
                    profile: user.profile,
                    country: user.country,
                    password: user.password
                }).pipe(
                    switchMap((response: any) => {
                        if (response) {
                            console.log('response for register');
                            console.log(response);
                            this.toastService.success("Enreggistrement effectuer avec succes. Connecter vous de suite.")
                            this.router.navigate(['auth/login']);
                            return of(RegisterSuccess({ isLoggedIn: true }));
                        } else {
                            return of(RegisterFailure({ error: 'Impossible de vous connecter' }));
                        }
                    }),
                    catchError((error: HttpErrorResponse) => {
                        if (error.status === 404) {
                            this.toastService.error(
                                "Impossible de vous authentifier. Connectez-vous à nous. Merci"
                            );
                        } else if (error.status === 400) {
                            this.toastService.error(
                                "Votre mot de passe est incorrect. Réessayez s'il vous plaît"
                            );
                        } else if (error.status === 403) {
                            this.toastService.error(
                                "Votre compte a été désactivé. Merci de contacter l'administrateur !"
                            );
                        } else {
                            this.toastService.error(error.message);
                        }
                        return of(RegisterFailure({ error: error.message }));
                    })
                );
            })
        )
    );

}