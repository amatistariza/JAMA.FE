import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cuidador } from '../models/cuidador';

@Injectable({
  providedIn: 'root'
})
export class CuidadorService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/cuidador';
  }

  getCuidadores(): Observable<Cuidador[]> {
    return this.http.get<Cuidador[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  getCuidadorById(id: number): Observable<Cuidador> {
    return this.http.get<Cuidador>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  addCuidador(cuidador: Cuidador): Observable<Cuidador> {
    return this.http.post<Cuidador>(`${this.myAppUrl}${this.myApiUrl}`, cuidador);
  }

  editCuidador(id: number, cuidador: Cuidador): Observable<Cuidador> {
    return this.http.put<Cuidador>(`${this.myAppUrl}${this.myApiUrl}/${id}`, cuidador);
  }

  deleteCuidador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }
}
