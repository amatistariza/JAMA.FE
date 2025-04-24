import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../../services/paciente.service';
import { LoginService } from '../../../services/login.service';
import { Paciente } from '../../../models/paciente';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buscar-paciente',
  template: `
    <div class="mb-3">
      <label class="form-label">Buscar Paciente*</label>
      <div class="input-group">
        <input 
          type="text" 
          class="form-control" 
          [formControl]="searchControl"
          placeholder="Ingrese número de identificación"
        />
        <button class="btn btn-outline-primary" (click)="irARegistro()">
          Registrar Nuevo Paciente
        </button>
      </div>
      <div *ngIf="pacienteSeleccionado" class="mt-2 alert alert-success">
        <strong>Paciente encontrado:</strong> 
        {{pacienteSeleccionado.primerNombre}} {{pacienteSeleccionado.primerApellido}}
      </div>
      <div *ngIf="mensajeError" class="alert alert-warning mt-2">
        {{mensajeError}}
      </div>
    </div>
  `
})
export class BuscarPacienteComponent {
  @Output() pacienteSelected = new EventEmitter<Paciente>();
  searchControl = new FormControl('');
  pacienteSeleccionado: Paciente | null = null;
  pacienteEncontrado = false;
  mensajeError: string = '';
  
  constructor(
    private pacienteService: PacienteService,
    private loginService: LoginService,
    private router: Router
  ) {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) {
          this.clearSearch();
          return of(null);
        }
        this.mensajeError = '';
        return this.pacienteService.getPacienteByNumeroIdentificacion(value).pipe(
          catchError(error => {
            console.log('Search error:', error);
            if (error.status === 404 || error.message === 'Paciente no encontrado') {
              this.mensajeError = 'Paciente no encontrado. ¿Desea registrarlo?';
            } else {
              this.mensajeError = 'Error al buscar paciente. Intente nuevamente.';
            }
            return of(null);
          })
        );
      })
    ).subscribe(paciente => {
      if (paciente) {
        console.log('Paciente encontrado:', paciente);
        this.pacienteSeleccionado = paciente;
        this.pacienteEncontrado = true;
        this.mensajeError = '';
        this.pacienteSelected.emit(paciente);
      } else if (this.searchControl.value) {
        this.pacienteSeleccionado = null;
        this.pacienteEncontrado = false;
      }
    });
  }

  private clearSearch() {
    this.pacienteSeleccionado = null;
    this.pacienteEncontrado = false;
    this.mensajeError = '';
  }

  irARegistro() {
    const user = this.loginService.getUserFromToken();
    if (user) {
      const currentUrl = this.router.url;
      const isAdmin = currentUrl.includes('/admin/');
      const userId = this.loginService.getUserIdFromToken();
      const path = isAdmin ? '/admin' : '/enfermera';
      
      if (userId) {
        Swal.fire({
          title: 'Paciente No Encontrado',
          text: '¿Desea registrar un nuevo paciente?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, registrar',
          cancelButtonText: 'No, cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            console.log('Navigating to:', `${path}/${userId}/gestionPaciente`); // Debug log
            this.router.navigate([`${path}/${userId}/gestionPaciente`]);
          }
        });
      }
    }
  }
}
