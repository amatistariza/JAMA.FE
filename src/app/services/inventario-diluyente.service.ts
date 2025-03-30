import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Diluyente } from '../models/diluyente';

@Injectable({
  providedIn: 'root'
})
export class InventarioDiluyenteService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint
    this.myApiUrl = 'api/diluyentes';
  }

  getDiluyentes(): Observable<Diluyente[]> {
    return this.http.get<Diluyente[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getDiluyenteById(id: number): Observable<Diluyente> {
    return this.http.get<Diluyente>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  addDiluyente(diluyente: Diluyente): Observable<Diluyente> {
    return this.http.post<Diluyente>(`${this.myAppUrl}${this.myApiUrl}`, diluyente);
  }

  editDiluyente(id: number, diluyente: Diluyente): Observable<Diluyente> {
    return this.http.put<Diluyente>(`${this.myAppUrl}${this.myApiUrl}/${id}`, diluyente);
  }

  deleteDiluyente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }
}
