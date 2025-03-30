import { Component, OnInit } from '@angular/core';
import { InventarioJeringaService } from '../../../services/inventario-jeringa.service';
import { Jeringa } from '../../../models/jeringa';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-inventario-jeringa',
  templateUrl: './gestion-inventario-jeringa.component.html',
  styleUrl: './gestion-inventario-jeringa.component.css'
})
export class GestionInventarioJeringaComponent {
  jeringas: Jeringa[] = [];
  jeringasFiltradas: Jeringa[] = [];
  jeringaSeleccionada: Jeringa | null = null;
  modoFormulario: 'crear' | 'editar' = 'crear';
  mostrarFormulario: boolean = false;

  itemsPorPagina: number = 5;
  paginaActual: number = 1;

  filtro: string = '';

  constructor(private jeringaService: InventarioJeringaService) {}
  
  ngOnInit(): void {
    this.loadJeringas();
  }

  loadJeringas(): void {
    this.jeringaService.getJeringas().subscribe(
      (jeringas) => {
        this.jeringas = jeringas;
        this.jeringasFiltradas = [...this.jeringas];
      },
      (error) => {
        console.error('Error al cargar los jeringas:', error);
      }
    );
  }

  // Cambiar página
  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  filtrarJeringas(): void {
    this.jeringasFiltradas = this.jeringas.filter((jeringa) =>
      jeringa.tipo.toLowerCase().includes(this.filtro.toLowerCase())
    );
    this.paginaActual = 1;
  }

  addItem(): void {
    this.modoFormulario = 'crear';
    this.jeringaSeleccionada = {
      id: 0,
      tipo: '',
      lote: '',
      cantidadDisponible: 0,
    };
    this.mostrarFormulario = true;
  }

  editItem(jeringa: Jeringa): void {
    this.modoFormulario = 'editar';
    this.jeringaSeleccionada = { ...jeringa };
    this.mostrarFormulario = true;
  }

  guardarJeringa(jeringa: Jeringa): void {
    if (this.modoFormulario === 'crear') {
      this.jeringaService.addJeringa(jeringa).subscribe(() => this.loadJeringas());
    } else {
      this.jeringaService.editJeringa(jeringa.id, jeringa).subscribe(() => this.loadJeringas());
    }
    this.mostrarFormulario = false;
  }

  eliminarJeringa(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.jeringaService.deleteJeringa(id).subscribe(() => {
          this.loadJeringas();
          Swal.fire('Eliminado', 'La jeringa ha sido eliminada con éxito.', 'success');
        });
      }
    });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
  }
}
