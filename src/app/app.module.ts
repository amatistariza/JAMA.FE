import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminModule } from './components/admin/admin.module';
import { GestionInventarioModule } from './components/admin/gestion-inventario/gestion-inventario.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { RouterModule } from '@angular/router';
import { GestionPacienteModule } from './components/admin/gestion-paciente/gestion-paciente.module';
import { GestionUsuarioModule } from './components/admin/gestion-usuario/gestion-usuario.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { LoadingService } from './services/loading.service';
import { CoreModule } from './core/core.module';
import { EnfermeraModule } from './components/enfermera/enfermera.module';
import { SharedComponentsModule } from './components/shared/shared-components.module';

export function tokenGetter(): string | null {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:4200"],
        disallowedRoutes: []
      }
    }),
    SharedComponentsModule,
    CoreModule,
    AdminModule,
    GestionPacienteModule,
    GestionUsuarioModule,
    GestionInventarioModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    LoadingService,
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
