import { Component } from '@angular/core';

@Component({
  selector: 'app-gestion-inventario-diluyente',
  templateUrl: './gestion-inventario-diluyente.component.html',
  styleUrl: './gestion-inventario-diluyente.component.css'
})
export class GestionInventarioDiluyenteComponent {
  editItem(id: number) {
    console.log(`Editar elemento con ID: ${id}`);
  }

  deleteItem(id: number) {
    console.log(`Eliminar elemento con ID: ${id}`);
  }

  addItem() {
    console.log('Añadir nuevo elemento');
  }
}
