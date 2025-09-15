import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AlarmaItem {
  id?: number;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  nombre: string;
  telefono?: string;
  celular?: string;
  correo?: string;
  pendiente?: string;
  fechaAplicacion?: string;
  ok?: boolean;
}

export interface AlarmasResponse {
  mensaje: string;
  data: AlarmaItem[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class AlarmasService {
  private baseUrl = 'http://localhost:5000/api/AlarmasVacunacion';

  constructor(private http: HttpClient) {}

  getProximasMesActual(): Observable<AlarmasResponse> {
    const url = `${this.baseUrl}/proximas-mes-actual`;
    return this.http.get<AlarmasResponse>(url);
  }

  marcarNotificada(alarmaId: number): Observable<any> {
    const url = `${this.baseUrl}/${alarmaId}/marcar-notificada`;
    return this.http.put<any>(url, {});
  }
}
