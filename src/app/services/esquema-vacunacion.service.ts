import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PacienteService } from './paciente.service';

@Injectable({
  providedIn: 'root'
})
export class EsquemaVacunacionService {
  private apiUrl = `${environment.endpoint}api/esquemavacunacion`;

  constructor(private http: HttpClient, private pacienteService: PacienteService) { }

  crearEsquema(esquemaData: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'text/plain');

    const formattedData = {
      ...esquemaData,
      usuarioId: Number(esquemaData.usuarioId),
      pacienteId: Number(esquemaData.pacienteId),
      detalles: esquemaData.detalles.map((detalle: any) => ({
        vacunaId: Number(detalle.vacunaId),
        jeringaId: Number(detalle.jeringaId),
        diluyenteId: detalle.diluyenteId ? Number(detalle.diluyenteId) : null,
        sueroId: detalle.sueroId ? Number(detalle.sueroId) : null,
        dosis: Number(detalle.dosis),
        cantidadUtilizadaVacuna: Number(detalle.cantidadUtilizadaVacuna),
        cantidadUtilizadaJeringa: Number(detalle.cantidadUtilizadaJeringa),
        cantidadUtilizadaSuero: Number(detalle.cantidadUtilizadaSuero),
        cantidadUtilizadaDiluyente: Number(detalle.cantidadUtilizadaDiluyente),
        via: detalle.via,
        sitioAplicacion: detalle.sitioAplicacion,
        lote: detalle.lote
      }))
    };

    return this.http.post(this.apiUrl, formattedData, { 
      headers: headers,
      responseType: 'text'
    });
  }

  getEsquemasByPacienteId(pacienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/paciente/${pacienteId}`);
  }

  getEsquemaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getEsquemaCompleto(id: number): Observable<any> {
    return this.getEsquemaById(id).pipe(
      switchMap(esquema => {
        return forkJoin({
          esquemaBase: Promise.resolve(esquema),
          paciente: this.pacienteService.getPacienteById(esquema.pacienteId)
        }).pipe(
          map(({ esquemaBase, paciente }) => ({
            ...esquemaBase,
            paciente
          }))
        );
      })
    );
  }
}
