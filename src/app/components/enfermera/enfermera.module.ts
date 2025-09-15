import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { SharedComponentsModule } from '../shared/shared-components.module';
import { AlertaEnfermeraComponent } from './alerta-enfermera/alerta-enfermera.component';
import { EnfermeraComponent } from './enfermera.component';

@NgModule({
  declarations: [
    AlertaEnfermeraComponent,
    EnfermeraComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SharedComponentsModule
],
  exports: [
    AlertaEnfermeraComponent,
    EnfermeraComponent,
    RouterModule
  ]
})
export class EnfermeraModule { }