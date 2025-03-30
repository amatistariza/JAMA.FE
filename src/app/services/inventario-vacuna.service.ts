import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Vacuna } from '../models/vacuna';

@Injectable({
  providedIn: 'root'
})
export class InventarioVacunaService {
  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/vacunas';
  }

  // Obtener todas las vacunas
  getVacunas(): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  // Obtener una vacuna por su ID
  getVacunaById(id: number): Observable<Vacuna> {
    return this.http.get<Vacuna>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  // Agregar una nueva vacuna
  addVacuna(vacuna: Vacuna): Observable<Vacuna> {
    return this.http.post<Vacuna>(`${this.myAppUrl}${this.myApiUrl}`, vacuna);
  }

  // Editar una vacuna existente
  editVacuna(id: number, vacuna: Vacuna): Observable<Vacuna> {
    return this.http.put<Vacuna>(`${this.myAppUrl}${this.myApiUrl}/${id}`, vacuna);
  }

  // Eliminar una vacuna por su ID
  deleteVacuna(id: number): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }
}