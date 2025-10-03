import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EstadisticaService {
    private apiUrl = `${environment.endpoint}api/estadisticas/`;

    constructor(private http: HttpClient) { }

    getEstadisticas(lowStockThreshold: number = 10): Observable<any> {
        const url = `${this.apiUrl}panel-enfermeria?lowStockThreshold=${lowStockThreshold}`;
        return this.http.get<any>(url);
    }

    getEstadisticasDosis(lowStockThreshold: number = 10): Observable<any> {
        const url = `${this.apiUrl}dosis-por-vacuna`;
        return this.http.get<any>(url);
    }

    /**
     * Obtener meses disponibles para los reportes.
     *
     * NOTE: Asumo que el backend expone un endpoint que devuelve un array de meses
     * en alguno de estos formatos:
     * - Array de strings 'YYYY-MM' (ej: '2025-01')
     * - Array de objetos { year: 2025, month: 1 }
     * Ajusta la ruta si tu API usa otra URL.
     */
    getAvailableMonths(): Observable<any> {
        const url = `${this.apiUrl}meses`;
        return this.http.get<any>(url);
    }

    /**
     * Obtener estadísticas de dosis, opcionalmente filtradas por mes en formato 'YYYY-MM'.
     */
    getEstadisticasDosisForMonth(month?: string): Observable<any> {
        let url = `${this.apiUrl}dosis-por-vacuna`;
        if (month) {
            // se agrega como query param 'month=YYYY-MM'
            url = `${url}?month=${encodeURIComponent(month)}`;
        }
        return this.http.get<any>(url);
    }

    getVacunasAplicadas(): Observable<any> {
        const url = `${this.apiUrl}vacunas-aplicadas`;
        return this.http.get<any>(url);
    }
}