import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { RegistroVacunaComponent } from './registro-vacuna/registro-vacuna.component';
import { BuscarPacienteComponent } from './buscar-paciente/buscar-paciente.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    RegistroVacunaComponent,
    BuscarPacienteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  exports: [
    LoadingSpinnerComponent,
    RegistroVacunaComponent,
    BuscarPacienteComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: []
})
export class SharedComponentsModule { }
