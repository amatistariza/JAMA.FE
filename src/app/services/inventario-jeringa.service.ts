import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Jeringa } from '../models/jeringa';

@Injectable({
  providedIn: 'root'
})
export class InventarioJeringaService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint
    this.myApiUrl = 'api/jeringas';
  }

  getJeringas(): Observable<Jeringa[]> {
    return this.http.get<Jeringa[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getJeringaById(id: number): Observable<Jeringa> {
    return this.http.get<Jeringa>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  addJeringa(jeringa: Jeringa): Observable<Jeringa> {
    return this.http.post<Jeringa>(`${this.myAppUrl}${this.myApiUrl}`, jeringa);
  }

  editJeringa(id: number, jeringa: Jeringa): Observable<Jeringa> {
    return this.http.put<Jeringa>(`${this.myAppUrl}${this.myApiUrl}/${id}`, jeringa);
  }

  deleteJeringa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }
}
