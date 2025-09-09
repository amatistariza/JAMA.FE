import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PacienteService } from './paciente.service';
import { Vacuna } from '../models/vacuna';

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
      VacunaId: Number(esquemaData.detalles[0].vacunaId),
      detalles: esquemaData.detalles.map((detalle: any) => ({
        VacunaId: Number(detalle.vacunaId),
        jeringaId: Number(detalle.jeringaId),
        diluyenteId: detalle.diluyenteId ? Number(detalle.diluyenteId) : null,
        dosis: Number(detalle.dosis),
        cantidadUtilizadaVacuna: Number(detalle.cantidadUtilizadaVacuna),
        cantidadUtilizadaJeringa: Number(detalle.cantidadUtilizadaJeringa),
        cantidadUtilizadaDiluyente: Number(detalle.cantidadUtilizadaDiluyente),
      })),
      viaDeAdministracion: String(esquemaData.viaDeAdministracion),
      sitioDeAplicacion: String(esquemaData.sitioDeAplicacion),
      Lote: String(esquemaData.lote),
      observaciones: String(esquemaData.observaciones),
      motivoIngreso: String(esquemaData.motivoIngreso)
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
