import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EstadisticaService {
    private apiUrl = `${environment.endpoint}api/estadisticas/panel-enfermeria`;

    constructor(private http: HttpClient) {}

    getEstadisticas(lowStockThreshold: number = 10): Observable<any> {
        const url = `${this.apiUrl}?lowStockThreshold=${lowStockThreshold}`;
        return this.http.get<any>(url);
    }
}