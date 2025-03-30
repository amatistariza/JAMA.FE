import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AntecedenteMedico } from '../models/antecedenteMedico';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AntecedenteMedicoService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/AntecedentesMedicos';
  }

  getAntecedenteMedicos(): Observable<AntecedenteMedico[]> {
    return this.http.get<AntecedenteMedico[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  
  getAntecedenteMedicoById(id: number): Observable<AntecedenteMedico> {
    return this.http.get<AntecedenteMedico>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  addAntecedenteMedico(antecedente: AntecedenteMedico): Observable<AntecedenteMedico> {
    return this.http.post<AntecedenteMedico>(`${this.myAppUrl}${this.myApiUrl}`, antecedente);
  }

  editAntecedenteMedico(id: number, antecedente: AntecedenteMedico): Observable<AntecedenteMedico> {
    return this.http.put<AntecedenteMedico>(`${this.myAppUrl}${this.myApiUrl}/${id}`, antecedente);
  }

  deleteAntecedenteMedico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }
}