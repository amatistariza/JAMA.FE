import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente } from '../models/paciente';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private apiUrl = `${environment.endpoint}/paciente`; // Cambiado a endpoint

  constructor(private http: HttpClient) { }

  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.apiUrl);
  }

  addPaciente(paciente: Paciente): Observable<Paciente> {
    // Asegurarse de que los campos numéricos se envíen como strings
    const pacienteToSend = {
      ...paciente,
      numeroIdentificacion: paciente.numeroIdentificacion.toString(),
      indicativoTelefono: paciente.indicativoTelefono.toString(),
      telefonoFijo: paciente.telefonoFijo.toString(),
      celular: paciente.celular.toString()
    };
    return this.http.post<Paciente>(this.apiUrl, pacienteToSend);
  }

  editPaciente(id: number, paciente: Paciente): Observable<Paciente> {
    const pacienteToSend = {
      ...paciente,
      numeroIdentificacion: paciente.numeroIdentificacion.toString(),
      indicativoTelefono: paciente.indicativoTelefono.toString(),
      telefonoFijo: paciente.telefonoFijo.toString(),
      celular: paciente.celular.toString()
    };
    return this.http.put<Paciente>(`${this.apiUrl}/${id}`, pacienteToSend);
  }

  deletePaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPacienteById(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}${id}`);
  }

  getPacienteByNumeroIdentificacion(numeroIdentificacion: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/BuscarPaciente/${numeroIdentificacion}`);
  }
}