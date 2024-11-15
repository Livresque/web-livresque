import {Injectable} from '@angular/core';
import {User} from 'src/app/store/Authentication/auth.models';

import * as CryptoJS from 'crypto-js';
import {ACCESS_TOKEN, REFRESH_TOKEN, SECRET_KEY, USER_DATA} from './constants';


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  // Crypte une donnée avec la clé secrète
  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  }

  // Décrypte une donnée avec la clé secrète
  private decryptData(data: string): string {
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // La méthode `signOut` efface uniquement les données spécifiques à l'application.
  signOut(): void {
    window.sessionStorage.removeItem(REFRESH_TOKEN);
    window.sessionStorage.removeItem(ACCESS_TOKEN);
    window.sessionStorage.removeItem(USER_DATA);
  }

  // La méthode `saveToken` crypte le token avant de le stocker dans la session storage.
  public saveRefreshToken(token: string): void {
    window.sessionStorage.removeItem(REFRESH_TOKEN);
    const encryptedToken = this.encryptData(token);
    window.sessionStorage.setItem(REFRESH_TOKEN, encryptedToken);
  }

  // La méthode `getToken` décrypte le token récupéré depuis la session storage.
  public getRefreshToken(): string {
    const encryptedToken = window.sessionStorage.getItem(REFRESH_TOKEN);
    if (encryptedToken) {
      return this.decryptData(encryptedToken);
    }
    return null;
  }

  // La méthode `saveUser` crypte les informations de l'utilisateur avant de les stocker dans la session storage.
  public saveUser(user: any): void {
    // window.sessionStorage.removeItem(USER_KEY);
    const encryptedUser = this.encryptData(JSON.stringify(user));
    window.sessionStorage.setItem(USER_DATA, encryptedUser);
  }

  // La méthode `getUser` décrypte les informations de l'utilisateur récupérées depuis la session storage.
  public getUser(): User {
    const encryptedUser = window.sessionStorage.getItem(USER_DATA);
    if (encryptedUser) {
      const decryptedUser = this.decryptData(encryptedUser);
      return JSON.parse(decryptedUser);
    }
    return {
      status: true,
      message: "",
      data: {
        user_id: 1,
        country: "",
        password: "",
        email: "",
        firstname: "Jn",
        lastname: "",
        username: "",
        address: {
          firstname: "",
          lastname: "",
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          postcode: "",
          country: "",
          state: "",
          phone: ""
        },
        role: "",
        profile_picture: "",
        profile: null,
        active: true,
        created_at: "",
        about: ""
      }


    };
  }


}
