import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { AdminComponent } from './admin.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReportesComponent } from './reportes/reportes.component';
import { ReportesDetalladosComponent } from './reportes-detallados/reportes-detallados.component';

@NgModule({
  declarations: [
    AdminComponent,
  ReportesComponent,
  ReportesDetalladosComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedComponentsModule,
  ],
  exports: [
    
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }