import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Suero } from '../models/suero';

@Injectable({
  providedIn: 'root'
})
export class InventarioSueroService {
  private apiUrl = 'https://localhost:44332/api/sueros';

  constructor(private http: HttpClient) { }

  getSueros(): Observable<Suero[]> {
    return this.http.get<Suero[]>(this.apiUrl);
  }

  getSueroById(id: number): Observable<Suero> {
    return this.http.get<Suero>(`${this.apiUrl}/${id}`);
  }

  addSuero(suero: Suero): Observable<Suero> {
    return this.http.post<Suero>(this.apiUrl, suero);
  }

  editSuero(id: number, suero: Suero): Observable<Suero> {
    return this.http.put<Suero>(`${this.apiUrl}/${id}`, suero);
  }

  deleteSuero(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
