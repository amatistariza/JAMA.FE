import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CondicionUsuaria } from '../models/condicionUsuaria';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CondicionUsuariaService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/Antecedente';
  }

  getCondicionUsuarias(): Observable<CondicionUsuaria[]> {
    return this.http.get<CondicionUsuaria[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  
  getCondicionUsuariaById(id: number): Observable<CondicionUsuaria> {
    return this.http.get<CondicionUsuaria>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  addCondicionUsuaria(condicionUsuaria: CondicionUsuaria): Observable<CondicionUsuaria> {
    return this.http.post<CondicionUsuaria>(`${this.myAppUrl}${this.myApiUrl}`, condicionUsuaria);
  }

  editCondicionUsuaria(id: number, condicionUsuaria: CondicionUsuaria): Observable<CondicionUsuaria> {
    return this.http.put<CondicionUsuaria>(`${this.myAppUrl}${this.myApiUrl}/${id}`, condicionUsuaria);
  }

  deleteCondicionUsuaria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }
}