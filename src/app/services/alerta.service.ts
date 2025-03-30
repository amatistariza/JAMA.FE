import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alerta } from '../models/alerta';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {
  private apiUrl = `${environment.endpoint}/alerta`;

  constructor(private http: HttpClient) { }

  getAlertas(): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(this.apiUrl);
  }

  marcarComoAtendida(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/atender`, {});
  }
}
