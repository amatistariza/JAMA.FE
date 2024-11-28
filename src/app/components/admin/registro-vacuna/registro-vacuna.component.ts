import { Component } from '@angular/core';

@Component({
  selector: 'app-registro-vacuna',
  templateUrl: './registro-vacuna.component.html',
  styleUrl: './registro-vacuna.component.css'
})
export class RegistroVacunaComponent {
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
