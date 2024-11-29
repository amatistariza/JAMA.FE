import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { GestionInventarioComponent } from './components/admin/gestion-inventario/gestion-inventario.component';
import { NavbarAdminComponent } from './components/admin/navbar-admin/navbar-admin.component';
import { GestionUsuarioComponent } from './components/admin/gestion-usuario/gestion-usuario.component';
import { RegistroVacunaComponent } from './components/admin/registro-vacuna/registro-vacuna.component';
import { GestionInventarioJeringaComponent } from './components/admin/gestion-inventario-jeringa/gestion-inventario-jeringa.component';
import { GestionInventarioDiluyenteComponent } from './components/admin/gestion-inventario-diluyente/gestion-inventario-diluyente.component';
import { AddTokenInterceptor } from './components/helpers/add-token.interceptor';

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
    RegistroVacunaComponent,
    GestionInventarioJeringaComponent,
    GestionInventarioDiluyenteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
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
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
