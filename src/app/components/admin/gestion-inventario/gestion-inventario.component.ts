import { Component } from '@angular/core';

@Component({
  selector: 'app-gestion-inventario',
  templateUrl: './gestion-inventario.component.html',
  styleUrl: './gestion-inventario.component.css'
})
export class GestionInventarioComponent {
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
