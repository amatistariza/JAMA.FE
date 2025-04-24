import { NgModule } from '@angular/core';
import { GestionUsuarioComponent } from './gestion-usuario.component';
import { AdminModule } from '../admin.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    GestionUsuarioComponent
  ],
  imports: [
    AdminModule,
    NgxPaginationModule
  ]
})
export class GestionUsuarioModule { }
