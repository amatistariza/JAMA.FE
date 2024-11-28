import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GestionInventarioComponent } from './components/admin/gestion-inventario/gestion-inventario.component';
import { NavbarAdminComponent } from './components/admin/navbar-admin/navbar-admin.component';
import { GestionUsuarioComponent } from './components/admin/gestion-usuario/gestion-usuario.component';
import { RegistroVacunaComponent } from './components/admin/registro-vacuna/registro-vacuna.component';
import { GestionInventarioJeringaComponent } from './components/admin/gestion-inventario-jeringa/gestion-inventario-jeringa.component';
import { GestionInventarioDiluyenteComponent } from './components/admin/gestion-inventario-diluyente/gestion-inventario-diluyente.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    GestionInventarioComponent,
    NavbarAdminComponent,
    GestionUsuarioComponent,
    RegistroVacunaComponent,
    GestionInventarioJeringaComponent,
    GestionInventarioDiluyenteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
