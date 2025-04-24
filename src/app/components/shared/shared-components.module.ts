import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuscarPacienteComponent } from './buscar-paciente/buscar-paciente.component';
import { RegistroVacunaComponent } from './registro-vacuna/registro-vacuna.component';
import { EsquemaDetallesComponent } from './esquema-detalles/esquema-detalles.component';
import { AdminModule } from '../admin/admin.module';
import { EnfermeraModule } from '../enfermera/enfermera.module';

@NgModule({
  declarations: [
    BuscarPacienteComponent,
    RegistroVacunaComponent,
    EsquemaDetallesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AdminModule,
    EnfermeraModule
  ],
  exports: [
    BuscarPacienteComponent,
    RegistroVacunaComponent,
    EsquemaDetallesComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedComponentsModule { }
