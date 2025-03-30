import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EsquemaVacunacion } from '../models/esquema-vacunacion';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EsquemaVacunacionService {
  private apiUrl = `${environment.endpoint}/EsquemaVacunacion`;

  constructor(private http: HttpClient) { }

  getEsquemaById(id: number): Observable<EsquemaVacunacion> {
    return this.http.get<EsquemaVacunacion>(`${this.apiUrl}/${id}`);
  }

  addEsquema(esquema: EsquemaVacunacion): Observable<EsquemaVacunacion> {
    return this.http.post<EsquemaVacunacion>(this.apiUrl, esquema);
  }

  updateEsquema(id: number, esquema: EsquemaVacunacion): Observable<EsquemaVacunacion> {
    return this.http.put<EsquemaVacunacion>(`${this.apiUrl}/${id}`, esquema);
  }

  deleteEsquema(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
