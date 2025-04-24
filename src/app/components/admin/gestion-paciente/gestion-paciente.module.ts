import { NgModule } from '@angular/core';
import { GestionPacienteComponent } from './gestion-paciente.component';
import { AdminModule } from '../admin.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    GestionPacienteComponent
  ],
  imports: [
    AdminModule,
    NgxPaginationModule
  ]
})
export class GestionPacienteModule { }
