import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Antecedente } from '../models/antecedente';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AntecedenteService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/Antecedente';
  }

  getAntecedentes(): Observable<Antecedente[]> {
    return this.http.get<Antecedente[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  
  getAntecedenteById(id: number): Observable<Antecedente> {
    return this.http.get<Antecedente>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  addAntecedente(antecedente: Antecedente): Observable<Antecedente> {
    return this.http.post<Antecedente>(`${this.myAppUrl}${this.myApiUrl}`, antecedente);
  }

  editAntecedente(id: number, antecedente: Antecedente): Observable<Antecedente> {
    return this.http.put<Antecedente>(`${this.myAppUrl}${this.myApiUrl}/${id}`, antecedente);
  }

  deleteAntecedente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }
}