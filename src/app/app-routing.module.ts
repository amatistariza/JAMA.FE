import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { GestionInventarioComponent } from './components/admin/gestion-inventario/gestion-inventario.component';
import { GestionUsuarioComponent } from './components/admin/gestion-usuario/gestion-usuario.component';
import { GestionInventarioJeringaComponent } from './components/admin/gestion-inventario-jeringa/gestion-inventario-jeringa.component';
import { GestionInventarioDiluyenteComponent } from './components/admin/gestion-inventario-diluyente/gestion-inventario-diluyente.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'admin/:id/home', component: AdminComponent },
  { path: 'admin/:id/gestionInventarioVacuna', component: GestionInventarioComponent },
  { path: 'admin/:id/gestionUsuario', component: GestionUsuarioComponent },
  { path: 'admin/:id/gestionInventarioJeringa', component: GestionInventarioJeringaComponent },
  { path: 'admin/:id/gestionInventarioDiluyente', component: GestionInventarioDiluyenteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
