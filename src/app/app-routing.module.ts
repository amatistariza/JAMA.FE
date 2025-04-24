import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { GestionInventarioComponent } from './components/admin/gestion-inventario/gestion-inventario.component';
import { GestionUsuarioComponent } from './components/admin/gestion-usuario/gestion-usuario.component';
import { GestionInventarioJeringaComponent } from './components/admin/gestion-inventario-jeringa/gestion-inventario-jeringa.component';
import { GestionInventarioDiluyenteComponent } from './components/admin/gestion-inventario-diluyente/gestion-inventario-diluyente.component';
import { GestionInventarioSueroComponent } from './components/admin/gestion-inventario-suero/gestion-inventario-suero.component';
import { EnfermeraComponent } from './components/enfermera/enfermera.component';
import { GestionPacienteComponent } from './components/admin/gestion-paciente/gestion-paciente.component';
import { AlertaEnfermeraComponent } from './components/enfermera/alerta-enfermera/alerta-enfermera.component';
import { NotFoundComponent } from './components/shared/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { RegistroVacunaComponent } from './components/shared/registro-vacuna/registro-vacuna.component';
import { EsquemaDetallesComponent } from './components/shared/esquema-detalles/esquema-detalles.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // Rutas de administrador
  {
    path: 'admin/:id',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ADMINISTRADOR' },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: AdminComponent },
      { path: 'gestionInventarioVacuna', component: GestionInventarioComponent },
      { path: 'gestionUsuario', component: GestionUsuarioComponent },
      { path: 'gestionInventarioJeringa', component: GestionInventarioJeringaComponent },
      { path: 'gestionInventarioDiluyente', component: GestionInventarioDiluyenteComponent },
      { path: 'gestionInventarioSuero', component: GestionInventarioSueroComponent },
      { path: 'gestionPaciente', component: GestionPacienteComponent },
      { path: 'registro-vacuna', component: RegistroVacunaComponent },
      { path: 'esquema-detalles/:esquemaId', component: EsquemaDetallesComponent }
    ]
  },

  // Rutas de enfermera
  {
    path: 'enfermera/:id',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'ENFERMERA' },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: EnfermeraComponent },
      { path: 'gestionPaciente', component: GestionPacienteComponent },
      { path: 'registro-vacuna', component: RegistroVacunaComponent },
      { path: 'alertas', component: AlertaEnfermeraComponent },
      { path: 'esquema-detalles/:esquemaId', component: EsquemaDetallesComponent }
    ]
  },

  // Ruta 404 y wildcard
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
