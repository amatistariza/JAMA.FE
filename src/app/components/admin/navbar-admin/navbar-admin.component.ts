import { Component } from '@angular/core';


@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrl: './navbar-admin.component.css'
})
export class NavbarAdminComponent {
  activeMenu: string | null = null;  // Menú principal abierto
  activeSubMenu: string | null = null; // Submenú abierto

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
}
