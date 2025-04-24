import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PacienteService } from '../../../services/paciente.service';
import { Paciente } from '../../../models/paciente';

@Component({
  selector: 'app-buscar-paciente',
  template: `
    <div class="mb-3">
      <label for="searchPacienteInput" class="form-label">Buscar Paciente*</label>
      <input 
        id="searchPacienteInput"
        type="text" 
        class="form-control" 
        placeholder="Número de identificación..."
        [(ngModel)]="searchTerm" 
        (keyup)="buscarPaciente()"
      >
      <div *ngIf="mensaje" [class]="mensajeClass">
        {{ mensaje }}
        <button *ngIf="!pacienteEncontrado" 
                class="btn btn-primary ms-2" 
                (click)="irARegistro()">
          Registrar Paciente
        </button>
      </div>
    </div>
  `,
  styles: [`
    .mensaje-error { color: red; margin-top: 5px; }
    .mensaje-success { color: green; margin-top: 5px; }
  `]
})
export class BuscarPacienteComponent {
  @Output() pacienteSelected = new EventEmitter<Paciente>();
  searchTerm: string = '';
  mensaje: string = '';
  mensajeClass: string = '';
  pacienteEncontrado: boolean = false;

  constructor(
    private pacienteService: PacienteService,
    private router: Router
  ) {}

  buscarPaciente() {
    if (this.searchTerm.length > 2) {
      this.pacienteService.getPacienteByNumeroIdentificacion(this.searchTerm)
        .subscribe({
          next: (paciente) => {
            if (paciente) {
              this.mensaje = `Paciente encontrado: ${paciente.primerNombre} ${paciente.primerApellido}`;
              this.mensajeClass = 'mensaje-success';
              this.pacienteEncontrado = true;
              this.pacienteSelected.emit(paciente);
            }
          },
          error: (error) => {
            if (error.message === 'Paciente no encontrado') {
              this.mensaje = 'Paciente no encontrado. ¿Desea registrarlo?';
              this.mensajeClass = 'mensaje-error';
              this.pacienteEncontrado = false;
              this.pacienteSelected.emit(null);
            } else {
              this.mensaje = 'Error al buscar paciente';
              this.mensajeClass = 'mensaje-error';
            }
          }
        });
    } else {
      this.mensaje = '';
    }
  }

  irARegistro() {
    this.router.navigate(['/admin', 'gestionPaciente']);
  }
}
