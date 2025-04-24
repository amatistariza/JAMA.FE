import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jeringa } from '../models/jeringa';

@Injectable({
  providedIn: 'root'
})
export class InventarioJeringaService {
  private apiUrl = 'https://localhost:44332/api/jeringas';

  constructor(private http: HttpClient) { }

  getJeringas(): Observable<Jeringa[]> {
    return this.http.get<Jeringa[]>(this.apiUrl);
  }

  getJeringaById(id: number): Observable<Jeringa> {
    return this.http.get<Jeringa>(`${this.apiUrl}/${id}`);
  }

  addJeringa(jeringa: Jeringa): Observable<Jeringa> {
    return this.http.post<Jeringa>(this.apiUrl, jeringa);
  }

  editJeringa(id: number, jeringa: Jeringa): Observable<Jeringa> {
    return this.http.put<Jeringa>(`${this.apiUrl}/${id}`, jeringa);
  }

  deleteJeringa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
