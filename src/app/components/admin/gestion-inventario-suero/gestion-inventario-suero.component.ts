import { Component, OnInit } from '@angular/core';
import { InventarioSueroService } from '../../../services/inventario-suero.service';
import { Suero } from '../../../models/suero';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-inventario-suero',
  templateUrl: './gestion-inventario-suero.component.html',
  styleUrl: './gestion-inventario-suero.component.css'
})
export class GestionInventarioSueroComponent implements OnInit {
  sueros: Suero[] = [];
  suerosFiltradas: Suero[] = [];
  sueroSeleccionada: Suero | null = null;
  modoFormulario: 'crear' | 'editar' = 'crear';
  mostrarFormulario: boolean = false;
  
  itemsPorPagina: number = 5;
  paginaActual: number = 1;

  filtro: string = '';

  constructor(private sueroService: InventarioSueroService) {}

  ngOnInit(): void {
    this.loadSueros();
  }

  loadSueros(): void {
    this.sueroService.getSueros().subscribe(
      (sueros) => {
        this.sueros = sueros;
        this.suerosFiltradas = [...this.sueros];
      },
      (error) => {
        console.error('Error al cargar los sueros:', error);
      }
    );
  }

  // Cambiar página
  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  filtrarSueros(): void {
    this.suerosFiltradas = this.sueros.filter((suero) =>
      suero.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
    this.paginaActual = 1;
  }

  addItem(): void {
    this.modoFormulario = 'crear';
    this.sueroSeleccionada = {
      id: 0,
      nombre: '',
      lote: '',
      frascosDisponibles: 0,
    };
    this.mostrarFormulario = true;
  }

  editItem(suero: Suero): void {
    this.modoFormulario = 'editar';
    this.sueroSeleccionada = { ...suero };
    this.mostrarFormulario = true;
  }

  guardarSuero(suero: Suero): void {
    if (this.modoFormulario === 'crear') {
      this.sueroService.addSuero(suero).subscribe(() => this.loadSueros());
    } else {
      this.sueroService.editSuero(suero.id, suero).subscribe(() => this.loadSueros());
    }
    this.mostrarFormulario = false;
  }

  eliminarSuero(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.sueroService.deleteSuero(id).subscribe(() => {
          this.loadSueros();
          Swal.fire('Eliminado', 'El suero ha sido eliminada con éxito.', 'success');
        });
      }
    });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
  }
}
