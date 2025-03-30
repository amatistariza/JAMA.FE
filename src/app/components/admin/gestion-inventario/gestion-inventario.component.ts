import { Component, OnInit } from '@angular/core';
import { InventarioVacunaService } from '../../../services/inventario-vacuna.service';
import { Vacuna } from '../../../models/vacuna';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-inventario',
  templateUrl: './gestion-inventario.component.html',
  styleUrls: ['./gestion-inventario.component.css']
})
export class GestionInventarioComponent implements OnInit {
  vacunas: Vacuna[] = [];
  vacunasFiltradas: Vacuna[] = [];
  vacunaSeleccionada: Vacuna | null = null;
  modoFormulario: 'crear' | 'editar' = 'crear';
  mostrarFormulario: boolean = false;
  
  // Paginación
  itemsPorPagina: number = 5;
  paginaActual: number = 1;

  // Filtro
  filtro: string = '';

  constructor(private vacunaService: InventarioVacunaService) {}

  ngOnInit(): void {
    this.loadVacunas(); // Cargar las vacunas al inicializar el componente
  }

  loadVacunas(): void {
    this.vacunaService.getVacunas().subscribe(
      (vacunas) => {
        this.vacunas = vacunas;
        this.vacunasFiltradas = [...this.vacunas]; // Inicializamos las vacunas filtradas
      },
      (error) => {
        console.error('Error al cargar las vacunas:', error);
      }
    );
  }

  // Cambiar página
  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  // Filtrar vacunas por nombre
  filtrarVacunas(): void {
    this.vacunasFiltradas = this.vacunas.filter((vacuna) =>
      vacuna.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
    this.paginaActual = 1; // Resetear a la primera página después de aplicar el filtro
  }

  addItem(): void {
    this.modoFormulario = 'crear';
    this.vacunaSeleccionada = {
      id: 0,
      nombre: '',
      laboratorio: '',
      lote: '',
      dosisDisponibles: 0,
      fechaRegistro: new Date(),
    };
    this.mostrarFormulario = true;
  }

  editItem(vacuna: Vacuna): void {
    this.modoFormulario = 'editar';
    this.vacunaSeleccionada = { ...vacuna };
    this.mostrarFormulario = true;
  }

  guardarVacuna(vacuna: Vacuna): void {
    if (this.modoFormulario === 'crear') {
      this.vacunaService.addVacuna(vacuna).subscribe(() => this.loadVacunas());
    } else {
      this.vacunaService.editVacuna(vacuna.id, vacuna).subscribe(() => this.loadVacunas());
    }
    this.mostrarFormulario = false;
  }

  eliminarVacuna(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.vacunaService.deleteVacuna(id).subscribe(() => {
          this.loadVacunas();
          Swal.fire('Eliminado', 'La vacuna ha sido eliminada con éxito.', 'success');
        });
      }
    });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
  }
}