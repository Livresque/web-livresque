import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from 'src/app/store/Authentication/auth.models';
import {environment} from "../../../environments/environment.prod";

@Injectable({ providedIn: 'root' })
export class UserProfileService {
    constructor(private http: HttpClient) { }

    /***
     * Get All User
     */
    getAll() {
        return this.http.get<User[]>(`users/`);
    }

    /***
     * Get All User
     */
    getDetailUser() {
        //J'utilise un intercepteur pour ajouter en automatique le header Baerer
        return this.http.get<User>(environment.api_url+'user-detail/');
    }


    /***
     * Facked User Register
     */
    register(user: User) {
        return this.http.post(`/users/register`, user);
    }
}
