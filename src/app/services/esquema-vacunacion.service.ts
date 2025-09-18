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
      tipoCarnet: String(esquemaData.tipoCarnet || ''),
      responsable: String(esquemaData.responsable || ''),
      registradoPAI: Boolean(esquemaData.registradoPAI || false),
      motivoIngreso: String(esquemaData.motivoIngreso || ''),
      observaciones: String(esquemaData.observaciones || ''),
      pacienteId: Number(esquemaData.pacienteId || 0),
      vacunaId: esquemaData.detalles && esquemaData.detalles.length ? Number(esquemaData.detalles[0].vacunaId) : Number(esquemaData.vacunaId || 0),
      numeroDeDosis: Number(esquemaData.numeroDeDosis || 0),
      viaDeAdministracion: String(esquemaData.viaDeAdministracion || ''),
      sitioDeAplicacion: String(esquemaData.sitioDeAplicacion || ''),
      lote: String(esquemaData.lote || ''),
      detalles: (esquemaData.detalles || []).map((detalle: any) => ({
        vacunaId: Number(detalle.vacunaId || 0),
        cantidadUtilizadaVacuna: Number(detalle.cantidadUtilizadaVacuna || 0),
        diluyenteId: detalle.diluyenteId ? Number(detalle.diluyenteId) : null,
        cantidadUtilizadaDiluyente: Number(detalle.cantidadUtilizadaDiluyente || 0),
        jeringaId: Number(detalle.jeringaId || 0),
        cantidadUtilizadaJeringa: Number(detalle.cantidadUtilizadaJeringa || 0)
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

  getNumeroDosisPorAplicar(pacienteId:number, vacunaId: number): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/validar?pacienteId=${pacienteId}&vacunaId=${vacunaId}`);
  } 

  getEsquemas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
