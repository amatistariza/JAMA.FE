import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GestionPacienteComponent } from './gestion-paciente.component';
import { AdminModule } from '../admin.module';
import { EnfermeraModule } from '../../enfermera/enfermera.module';
import { PacienteComponent } from './paciente/paciente.component';
import { TablaMadreComponent } from './paciente/tabla-madre/tabla-madre.component';
import { MadreFormComponent } from './paciente/tabla-madre/madre-form/madre-form.component';
import { TablaCuidadorComponent } from './paciente/tabla-cuidador/tabla-cuidador.component';
import { CuidadorFormComponent } from './paciente/tabla-cuidador/cuidador-form/cuidador-form.component';

@NgModule({
  declarations: [
    GestionPacienteComponent,
    PacienteComponent,
    TablaMadreComponent,
    MadreFormComponent,
    TablaCuidadorComponent,
    CuidadorFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AdminModule,
    EnfermeraModule
  ],
  exports: [
    GestionPacienteComponent,
    PacienteComponent,
    TablaMadreComponent,
    MadreFormComponent,
    TablaCuidadorComponent,
    CuidadorFormComponent
  ]
})
export class GestionPacienteModule { }
