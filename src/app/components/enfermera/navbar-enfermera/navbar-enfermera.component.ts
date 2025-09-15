import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-navbar-enfermera',
  templateUrl: './navbar-enfermera.component.html',
  styleUrl: './navbar-enfermera.component.css'
})
export class NavbarEnfermeraComponent implements OnInit {
  activeMenu: string | null = null;  // Menú principal abierto
  activeSubMenu: string | null = null; // Submenú abierto
  userId: string | null = null;  // Variable para almacenar el ID del usuario


  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userId = this.loginService.getUserIdFromToken(); // Obtener el ID del usuario desde el token
  }

  // Alternar estado de un menú principal
  toggleMenu(menu: string) {
    this.activeMenu = (this.activeMenu === menu) ? null : menu;
  }

  // Verificar si un menú está activo
  isActiveMenu(menu: string): boolean {
    return this.activeMenu === menu;
  }

  // Alternar estado de un submenú
  toggleSubMenu(subMenu: string) {
    this.activeSubMenu = (this.activeSubMenu === subMenu) ? null : subMenu;
  }

  // Verificar si un submenú está activo
  isActiveSubMenu(subMenu: string): boolean {
    return this.activeSubMenu === subMenu;
  }

  cerrarSesion(): void {
    this.loginService.removeLocalStorage();
    this.router.navigate(['/login']);
  }



}
