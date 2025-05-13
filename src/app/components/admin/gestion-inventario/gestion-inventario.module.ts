import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminModule } from '../admin.module';
import { GestionInventarioComponent } from './gestion-inventario.component';
import { GestionInventarioSueroComponent } from '../gestion-inventario-suero/gestion-inventario-suero.component';
import { GestionInventarioJeringaComponent } from '../gestion-inventario-jeringa/gestion-inventario-jeringa.component';
import { GestionInventarioDiluyenteComponent } from '../gestion-inventario-diluyente/gestion-inventario-diluyente.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    GestionInventarioComponent,
    GestionInventarioSueroComponent,
    GestionInventarioJeringaComponent,
    GestionInventarioDiluyenteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminModule,
    NgxPaginationModule
  ]
})
export class GestionInventarioModule { }
