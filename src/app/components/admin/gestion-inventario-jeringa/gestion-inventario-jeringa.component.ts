import { Component } from '@angular/core';

@Component({
  selector: 'app-gestion-inventario-jeringa',
  templateUrl: './gestion-inventario-jeringa.component.html',
  styleUrl: './gestion-inventario-jeringa.component.css'
})
export class GestionInventarioJeringaComponent {
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
