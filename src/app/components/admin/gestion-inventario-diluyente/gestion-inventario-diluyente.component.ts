import { Component, OnInit } from '@angular/core';
import { InventarioDiluyenteService } from '../../../services/inventario-diluyente.service';
import { Diluyente } from '../../../models/diluyente';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-gestion-inventario-diluyente',
  templateUrl: './gestion-inventario-diluyente.component.html',
  styleUrl: './gestion-inventario-diluyente.component.css'
})
export class GestionInventarioDiluyenteComponent implements OnInit {
  diluyentes: Diluyente[] = [];
  diluyentesFiltradas: Diluyente[] = [];
  diluyenteSeleccionada: Diluyente | null = null;
  modoFormulario: 'crear' | 'editar' = 'crear';
  mostrarFormulario: boolean = false;
  
  itemsPorPagina: number = 5;
  paginaActual: number = 1;

  filtro: string = '';

  constructor(private diluyenteService: InventarioDiluyenteService) {}

  ngOnInit(): void {
    this.loadDiluyentes();
  }

  loadDiluyentes(): void {
    this.diluyenteService.getDiluyentes().subscribe(
      (diluyentes) => {
        this.diluyentes = diluyentes;
        this.diluyentesFiltradas = [...this.diluyentes];
      },
      (error) => {
        console.error('Error al cargar los diluyentes:', error);
      }
    );
  }

  // Cambiar página
  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  // Filtrar vacunas por nombre
  filtrarDiluyentes(): void {
    this.diluyentesFiltradas = this.diluyentes.filter((diluyente) =>
      diluyente.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
    this.paginaActual = 1;
  }

  addItem(): void {
    this.modoFormulario = 'crear';
    this.diluyenteSeleccionada = {
      id: 0,
      nombre: '',
      lote: '',
      cantidadDisponible: 0,
    };
    this.mostrarFormulario = true;
  }

  editItem(diluyente: Diluyente): void {
    this.modoFormulario = 'editar';
    this.diluyenteSeleccionada = { ...diluyente };
    this.mostrarFormulario = true;
  }

  guardarDiluyente(diluyente: Diluyente): void {
    if (this.modoFormulario === 'crear') {
      this.diluyenteService.addDiluyente(diluyente).subscribe(() => this.loadDiluyentes());
    } else {
      this.diluyenteService.editDiluyente(diluyente.id, diluyente).subscribe(() => this.loadDiluyentes());
    }
    this.mostrarFormulario = false;
  }

  eliminarDiluyente(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.diluyenteService.deleteDiluyente(id).subscribe(() => {
          this.loadDiluyentes();
          Swal.fire('Eliminado', 'La vacuna ha sido eliminada con éxito.', 'success');
        });
      }
    });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
  }
}
