import { Component } from '@angular/core';

@Component({
  selector: 'app-gestion-usuario',
  templateUrl: './gestion-usuario.component.html',
  styleUrl: './gestion-usuario.component.css'
})
export class GestionUsuarioComponent {
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
