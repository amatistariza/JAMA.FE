import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuscarPacienteComponent } from './buscar-paciente/buscar-paciente.component';
import { RegistroVacunaComponent } from './registro-vacuna/registro-vacuna.component';
import { EsquemaDetallesComponent } from './esquema-detalles/esquema-detalles.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlarmasComponent } from './alarmas/alarmas.component';
import { NavbarEnfermeraComponent } from '../enfermera/navbar-enfermera/navbar-enfermera.component';
import { NavbarAdminComponent } from '../admin/navbar-admin/navbar-admin.component';
import { GestionAlarmasComponent } from './gestion-alarmas/gestion-alarmas.component';

@NgModule({
  declarations: [
    BuscarPacienteComponent,
    RegistroVacunaComponent,
    EsquemaDetallesComponent,
    AlarmasComponent,
    NavbarEnfermeraComponent,
    NavbarAdminComponent,
    GestionAlarmasComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
  exports: [
    BuscarPacienteComponent,
    RegistroVacunaComponent,
    EsquemaDetallesComponent,
    AlarmasComponent,
    NavbarEnfermeraComponent,
    NavbarAdminComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedComponentsModule { }
