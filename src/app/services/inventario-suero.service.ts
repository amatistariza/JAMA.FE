import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Suero } from '../models/suero';

@Injectable({
  providedIn: 'root'
})
export class InventarioSueroService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint
    this.myApiUrl = 'api/sueros';
  }

  getSueros(): Observable<Suero[]> {
    return this.http.get<Suero[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getSueroById(id: number): Observable<Suero> {
    return this.http.get<Suero>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  addSuero(suero: Suero): Observable<Suero> {
    return this.http.post<Suero>(`${this.myAppUrl}${this.myApiUrl}`, suero);
  }

  editSuero(id: number, suero: Suero): Observable<Suero> {
    return this.http.put<Suero>(`${this.myAppUrl}${this.myApiUrl}/${id}`, suero);
  }

  deleteSuero(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }
}
