import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ConnectionTimerService {
  private connectionTimeSubject: BehaviorSubject<Date | null> = new BehaviorSubject<Date | null>(null);
  private connectionTime: Date | null = null;
  private secretKey = 'mySecretKey'; // Clé secrète pour le chiffrement/déchiffrement

  constructor() {
    // Vérifier si les informations de connexion existent dans le localStorage
    const encryptedTime = localStorage.getItem('connectionTime');
    if (encryptedTime) {
      this.connectionTime = this.decryptData(encryptedTime);
      this.connectionTimeSubject.next(this.connectionTime);
    } else {
      this.recordConnectionTime();
    }
  }

  // Méthode pour enregistrer l'heure de connexion et la sauvegarder dans le localStorage
  private recordConnectionTime() {
    this.connectionTime = new Date();
    const encryptedTime = this.encryptData(this.connectionTime);
    localStorage.setItem('connectionTime', encryptedTime);
    this.connectionTimeSubject.next(this.connectionTime);
  }

  // Chiffrement des données avant de les sauvegarder
  private encryptData(data: Date): string {
    return CryptoJS.AES.encrypt(data.toString(), this.secretKey).toString();
  }

  // Déchiffrement des données récupérées du localStorage
  private decryptData(encryptedData: string): Date {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return new Date(decryptedData);
  }

  // Récupérer l'heure de connexion via le BehaviorSubject
  getConnectionTime() {
    return this.connectionTimeSubject.asObservable(); // Observable pour s'abonner dans le composant
  }

  // Calculer la durée de connexion (en secondes) depuis l'heure de connexion jusqu'à l'instant présent
  getConnectionDuration(): Date | null {
    if (this.connectionTime) {
      const now = new Date();
      const durationInMilliseconds = now.getTime() - this.connectionTime.getTime();
      // Crée un nouvel objet Date basé sur l'époque et ajoute la durée en millisecondes
      return new Date(durationInMilliseconds);
    }
    return null; // Retourne null si pas encore connecté
  }


  // Effacer les données de connexion du localStorage lors de la déconnexion
  clearConnectionData() {
    localStorage.removeItem('connectionTime');
    this.connectionTimeSubject.next(null);
  }
}
