import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class CrudService {
    constructor(private http: HttpClient) { }

    /***
     * Get 
     */
    fetchData(url: any): Observable<any[]> {
        return this.http.get<any[]>(url);
    }

    fetchDataOne(url: any): Observable<any> {
        return this.http.get<any>(url);
    }

    fetchDataWithHeader(url: string, headers: HttpHeaders): Observable<any> {
        return this.http.get<any>(url, { headers });
    }


    addData(url: any, newData: any): Observable<any[]> {
        return this.http.post<any[]>(url, newData);
    }

    addDataWithHeader(url: any, newData: any, headers: HttpHeaders): Observable<any> {
        console.log(newData)
        return this.http.post<any>(url, newData, { headers });
    }

    updateData(url: any, updatedData: any): Observable<any[]> {
        return this.http.put<any[]>(url, updatedData);
    }

    patchData(url: any, updatedData: any): Observable<any[]> {
        return this.http.patch<any[]>(url, updatedData);
    }

    deleteData(url: any): Observable<void> {
        return this.http.delete<void>(url);
    }
}
