import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Cuidador } from '../../../../../models/cuidador';
import { CuidadorService } from '../../../../../services/cuidador.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabla-cuidador',
  templateUrl: './tabla-cuidador.component.html',
  styleUrls: ['./tabla-cuidador.component.css']
})
export class TablaCuidadorComponent implements OnInit {
  @Input() cuidadores: Cuidador[] = [];
  cuidadoresFiltradas: Cuidador[] = [];
  cuidadorSeleccionado: Cuidador | null = null;
  mostrarFormulario = false;
  modoFormulario: 'crear' | 'editar' = 'crear';

  @Output() onVolver = new EventEmitter<void>();
  @Output() onSeleccionarCuidador = new EventEmitter<Cuidador>();

  filtro: string = '';
  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  constructor(private cuidadorService: CuidadorService) {}

  ngOnInit(): void {
    this.loadCuidadores();
  }

  loadCuidadores(): void {
    this.cuidadorService.getCuidadores().subscribe({
      next: (cuidadores) => {
        this.cuidadores = cuidadores;
        this.cuidadoresFiltradas = [...this.cuidadores];
      },
      error: (error) => {
        console.error('Error al cargar los cuidadores:', error);
        Swal.fire('Error', 'No se pudieron cargar los cuidadores', 'error');
      }
    });
  }

  addCuidador(): void {
    this.modoFormulario = 'crear';
    this.cuidadorSeleccionado = null;
    this.mostrarFormulario = true;
  }

  editCuidador(cuidador: Cuidador): void {
    this.modoFormulario = 'editar';
    this.cuidadorSeleccionado = cuidador;
    this.mostrarFormulario = true;
  }

  eliminarCuidador(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cuidadorService.deleteCuidador(id).subscribe({
          next: () => {
            this.loadCuidadores();
            Swal.fire('¡Eliminado!', 'El cuidador ha sido eliminado.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar el cuidador:', error);
            Swal.fire('Error', 'No se pudo eliminar el cuidador', 'error');
          }
        });
      }
    });
  }

  volverAlFormulario(): void {
    this.onVolver.emit();
  }

  filtrarCuidadores(): void {
    this.cuidadoresFiltradas = this.cuidadores.filter((cuidador) =>
      cuidador.numeroIdentificacion.toString().toLowerCase().includes(this.filtro.toLowerCase())
    );
    this.paginaActual = 1;
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  seleccionarCuidador(cuidador: Cuidador): void {
    console.log('Cuidador seleccionado:', cuidador);
    this.onSeleccionarCuidador.emit(cuidador);
    this.onVolver.emit();
  }

  onFormGuardar(): void {
    this.loadCuidadores();
    this.mostrarFormulario = false;
  }

  onFormCancelar(): void {
    this.mostrarFormulario = false;
  }
}
