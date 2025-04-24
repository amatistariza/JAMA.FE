import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Diluyente } from '../models/diluyente';

@Injectable({
  providedIn: 'root'
})
export class InventarioDiluyenteService {
  private apiUrl = 'https://localhost:44332/api/diluyentes';

  constructor(private http: HttpClient) { }

  getDiluyentes(): Observable<Diluyente[]> {
    return this.http.get<Diluyente[]>(this.apiUrl);
  }

  getDiluyenteById(id: number): Observable<Diluyente> {
    return this.http.get<Diluyente>(`${this.apiUrl}/${id}`);
  }

  addDiluyente(diluyente: Diluyente): Observable<Diluyente> {
    return this.http.post<Diluyente>(this.apiUrl, diluyente);
  }

  editDiluyente(id: number, diluyente: Diluyente): Observable<Diluyente> {
    return this.http.put<Diluyente>(`${this.apiUrl}/${id}`, diluyente);
  }

  deleteDiluyente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
