import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarAdminComponent } from './navbar-admin/navbar-admin.component';
import { AdminComponent } from './admin.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    NavbarAdminComponent,
    AdminComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  exports: [
    NavbarAdminComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }