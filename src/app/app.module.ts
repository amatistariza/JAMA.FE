import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { GestionInventarioComponent } from './components/admin/gestion-inventario/gestion-inventario.component';
import { NavbarAdminComponent } from './components/admin/navbar-admin/navbar-admin.component';
import { GestionUsuarioComponent } from './components/admin/gestion-usuario/gestion-usuario.component';
import { GestionInventarioJeringaComponent } from './components/admin/gestion-inventario-jeringa/gestion-inventario-jeringa.component';
import { GestionInventarioDiluyenteComponent } from './components/admin/gestion-inventario-diluyente/gestion-inventario-diluyente.component';
import { AddTokenInterceptor } from './components/helpers/add-token.interceptor';
import { VacunaFormComponent } from './components/admin/gestion-inventario/vacuna-form/vacuna-form.component';
import { UsuarioFormComponent } from './components/admin/gestion-usuario/usuario-form/usuario-form.component';
import { GestionInventarioSueroComponent } from './components/admin/gestion-inventario-suero/gestion-inventario-suero.component';
import { SueroFormComponent } from './components/admin/gestion-inventario-suero/suero-form/suero-form.component';
import { JeringaFormComponent } from './components/admin/gestion-inventario-jeringa/jeringa-form/jeringa-form.component';
import { DiluyenteFormComponent } from './components/admin/gestion-inventario-diluyente/diluyente-form/diluyente-form.component';
import { EnfermeraComponent } from './components/enfermera/enfermera.component';
import { NavbarEnfermeraComponent } from './components/enfermera/navbar-enfermera/navbar-enfermera.component';
import { AlertaEnfermeraComponent } from './components/enfermera/alerta-enfermera/alerta-enfermera.component';
import { PacienteComponent } from './components/admin/gestion-paciente/paciente/paciente.component';
import { GestionPacienteComponent } from './components/admin/gestion-paciente/gestion-paciente.component';
import { TablaMadreComponent } from './components/admin/gestion-paciente/paciente/tabla-madre/tabla-madre.component';
import { TablaCuidadorComponent } from './components/admin/gestion-paciente/paciente/tabla-cuidador/tabla-cuidador.component';
import { MadreFormComponent } from './components/admin/gestion-paciente/paciente/tabla-madre/madre-form/madre-form.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { CuidadorFormComponent } from './components/admin/gestion-paciente/paciente/tabla-cuidador/cuidador-form/cuidador-form.component';
import { RegistroVacunaComponent } from './components/shared/registro-vacuna/registro-vacuna.component';
import { LoadingSpinnerComponent } from './components/shared/loading-spinner/loading-spinner.component';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { LoadingService } from './services/loading.service';

export function tokenGetter(): string | null {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    GestionInventarioComponent,
    NavbarAdminComponent,
    GestionUsuarioComponent,
    GestionInventarioJeringaComponent,
    GestionInventarioDiluyenteComponent,
    VacunaFormComponent,
    UsuarioFormComponent,
    GestionInventarioSueroComponent,
    SueroFormComponent,
    JeringaFormComponent,
    DiluyenteFormComponent,
    EnfermeraComponent,
    NavbarEnfermeraComponent,
    AlertaEnfermeraComponent,
    PacienteComponent,
    GestionPacienteComponent,
    TablaMadreComponent,
    TablaCuidadorComponent,
    MadreFormComponent,
    NotFoundComponent,
    CuidadorFormComponent,
    RegistroVacunaComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:4200'],
        disallowedRoutes: ['http://localhost:4200/api/auth/login']
      }
    })
  ],
  providers: [
    provideClientHydration(),
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    LoadingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
