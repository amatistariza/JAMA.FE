import { NgModule } from '@angular/core';
import { GestionUsuarioComponent } from './gestion-usuario.component';
import { AdminModule } from '../admin.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';

@NgModule({
  declarations: [
    GestionUsuarioComponent,
    UsuarioFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminModule,
    NgxPaginationModule
  ],
  exports: [
    GestionUsuarioComponent,
    UsuarioFormComponent
  ]
})
export class GestionUsuarioModule { }
