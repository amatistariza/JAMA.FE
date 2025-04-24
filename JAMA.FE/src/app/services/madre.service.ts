import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Madre } from '../models/madre';

@Injectable({
  providedIn: 'root'
})
export class MadreService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/madres';
  }

  getMadres(): Observable<Madre[]> {
    return this.http.get<Madre[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getMadreById(id: number): Observable<Madre> {
    return this.http.get<Madre>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  addMadre(madre: Madre): Observable<Madre> {
    return this.http.post<Madre>(`${this.myAppUrl}${this.myApiUrl}`, madre);
  }

  editMadre(id: number, madre: Madre): Observable<Madre> {
    return this.http.put<Madre>(`${this.myAppUrl}${this.myApiUrl}/${id}`, madre);
  }

  deleteMadre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }
}
