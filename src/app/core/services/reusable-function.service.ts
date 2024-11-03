import { Injectable } from '@angular/core';
import {ValidationErrors} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

export interface DateTimePartsInterface{
  day: string;
  monthNumber: string;
  monthName: string;
  monthNameComplet: string;
  year: string;
  time:string;
}
@Injectable({
  providedIn: 'root'
})
export class ReusableFunctionService {

  fieldLabels = {
    username: "Nom d'utilisateur",
    first_name: "Prénom",
    last_name: "Nom de famille",
    phone: "Numéro de téléphone",
    email: "Adresse e-mail",
    address: "Adresse",
    profile: "Profil"
  };

  constructor(
      private http: HttpClient
  ) { }
  getErrorMessage(key: string, controlErrors: ValidationErrors): string {
    const fieldLabel = this.fieldLabels[key] || key; // Utilise le label si trouvé, sinon la clé brute
    if (controlErrors['required']) {
      return `${fieldLabel} doit être rempli.`;
    }
    if (controlErrors['minlength']) {
      const requiredLength = controlErrors['minlength'].requiredLength;
      return `${fieldLabel} doit avoir au moins ${requiredLength} caractères.`;
    }
    if (controlErrors['maxlength']) {
      const requiredLength = controlErrors['maxlength'].requiredLength;
      return `${fieldLabel} ne doit pas dépasser ${requiredLength} caractères.`;
    }
    if (controlErrors['email']) {
      return `${fieldLabel} doit être une adresse e-mail valide.`;
    }
    return `Erreur dans le champ ${fieldLabel}.`;
  }

  separateDateAndTime(dateTimeString: string): DateTimePartsInterface {
    // dateTimeString = "2023-07-19T12:00:00Z"
    if (!dateTimeString || isNaN(Date.parse(dateTimeString))) {
      throw new Error('Invalid date string');
    }

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNumber = (date.getMonth() + 1).toString().padStart(2, '0');
    const monthName = monthNames[date.getMonth()].substring(0, 3);
    const monthNameComplet = monthNames[date.getMonth()];
    const year = date.getFullYear().toString();
    const time = date.toTimeString().split(' ')[0];
    return {
      day,
      monthNumber,
      monthName,
      monthNameComplet,
      year,
      time
    };
  }

  generateRandomPassword(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password
  }

  NormaliseToLowerCase(value: any) {
    return typeof value === 'string' ? value.trim().toLowerCase() : value;
  };

  calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
    if (originalPrice <= 0) {
      throw new Error("Le prix initial doit être supérieur à zéro.");
    }
    const discountPercentage = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return discountPercentage;
  }

  formatValuesString(valuesString: string): string | null {
    // Remplacer chaque '#' par ', ' pour obtenir le format  // Affiche "A, B, C"
    return valuesString.split('#').join(', ');
  }

  splitValuesString(valuesString: string): string[] {
    // Sépare la chaîne en un tableau à chaque '#' // Affiche ["A", "B", "C"]
    return valuesString.split('#');
  }

  // Fonction pour convertir une image en base64
  // Fonction asynchrone avec async/await qui renvoie un string ou null
  async convertImageUrlToBase64(imageUrl: string): Promise<string | null> {
    try {
      // Télécharge l'image sous forme de Blob
      const blob = await this.http.get(imageUrl, { responseType: 'blob' }).toPromise();

      return await this.blobToBase64(blob);
    } catch (error) {
      console.error("Erreur lors de la conversion de l'image : ", error);
      return null;
    }
  }

  // Fonction utilitaire pour convertir un blob en base64
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(null);
      reader.readAsDataURL(blob); // Convertit le blob en base64
    });
  }
}
