import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CambiarPasswordComponent } from '../components/shared/cambiar-password/cambiar-password.component';

@NgModule({
  declarations: [
    CambiarPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CambiarPasswordComponent
  ]
})
export class CoreModule { }
