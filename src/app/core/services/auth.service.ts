import { Injectable } from '@angular/core';

import { getFirebaseBackend } from '../../authUtils';
import {User, UserData} from 'src/app/store/Authentication/auth.models';
import { from, map } from 'rxjs';
import {CrudService} from "./crud.service";
import {environment} from "../../../environments/environment.prod";
import {TokenStorageService} from "./token-storage.service";
import {Router} from "@angular/router";
import {headersAuth} from "./constants";


@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    user: User;

    constructor(
        private crudService: CrudService,
        public tokenStorage: TokenStorageService,
        private router: Router

    ) {
    }

    /**
     * Returns the current user
     */
    public currentUser(): User {
        return  this.tokenStorage.getUser() ;
    }


    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    login(email: string, password: string) {
        // console.log("Fonction login se lance bien !")
        const loginData = {
            "username": email,
            "password": password
        }
       return  this.crudService.addData(environment.api_url+'users/login/', loginData);
    }

    /**
     * Performs the register
     * @param user email
     */
    register(user: Partial<UserData>) {
        return  this.crudService.addDataWithHeader(environment.api_url+'users/create/', user, headersAuth);
    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return  this.crudService.addData(environment.api_url+'password-reset/', {email: email});
    }

    /**
     * Logout the user
     */
    logout() {
        // logout the user
        this.tokenStorage.signOut();
        this.router.navigate(['/auth/login']);
    }
}

