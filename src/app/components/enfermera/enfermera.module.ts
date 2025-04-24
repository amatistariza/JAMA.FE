import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NavbarEnfermeraComponent } from './navbar-enfermera/navbar-enfermera.component';
import { AlertaEnfermeraComponent } from './alerta-enfermera/alerta-enfermera.component';
import { EnfermeraComponent } from './enfermera.component';

@NgModule({
  declarations: [
    NavbarEnfermeraComponent,
    AlertaEnfermeraComponent,
    EnfermeraComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    NavbarEnfermeraComponent,
    AlertaEnfermeraComponent,
    EnfermeraComponent,
    RouterModule
  ]
})
export class EnfermeraModule { }