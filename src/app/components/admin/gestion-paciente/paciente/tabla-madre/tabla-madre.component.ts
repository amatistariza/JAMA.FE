import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Madre } from '../../../../../models/madre';
import { MadreService } from '../../../../../services/madre.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabla-madre',
  templateUrl: './tabla-madre.component.html',
  styleUrls: ['./tabla-madre.component.css'],
})
export class TablaMadreComponent implements OnInit {
  madres: Madre[] = [];
  madresFiltradas: Madre[] = [];
  madreSeleccionada: Madre | null = null;
  madreSeleccionadaEditar: Madre | null = null;
  @Output() onSeleccionarMadre = new EventEmitter<Madre>();
  @Output() onVolver = new EventEmitter<void>();

  filtro: string = '';
  paginaActual: number = 1;
  itemsPorPagina: number = 5;
  mostrarFormulario: boolean = false;
  modoFormulario: 'crear' | 'editar' = 'crear';

  constructor(private madreService: MadreService ) {}

  ngOnInit(): void {
    this.loadMadres();
  }

  loadMadres(): void {
    this.madreService.getMadres().subscribe(
      (madres) => {
        this.madres = madres;
        this.madresFiltradas = [...this.madres];
      },
      (error) => {
        console.error('Error al cargar las madres:', error);
      }
    );
  }

  volverAlFormulario(): void {
    this.onVolver.emit();
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  filtrarMadres(): void {
    this.madresFiltradas = this.madres.filter((madre) =>
      madre.numeroIdentificacion.toString().toLowerCase().includes(this.filtro.toLowerCase())
    );
    this.paginaActual = 1;
  }

  seleccionarMadre(madre: Madre): void {
    console.log('Madre seleccionada:', madre);
    this.onSeleccionarMadre.emit(madre);
    this.onVolver.emit();
  }

  addMadre(): void {
    this.modoFormulario = 'crear';
    this.madreSeleccionadaEditar = null;
    this.mostrarFormulario = true;
  }

  editMadre(madre: Madre): void {
    this.modoFormulario = 'editar';
    this.madreSeleccionadaEditar = { ...madre };
    this.mostrarFormulario = true;
  }

  guardarMadre(madre: Madre): void {
    if (this.modoFormulario === 'crear') {
      this.madreService.addMadre(madre).subscribe(() => {
        this.loadMadres();
        this.mostrarFormulario = false;
      });
    } else {
      this.madreService.editMadre(madre.id, madre).subscribe(() => {
        this.loadMadres();
        this.mostrarFormulario = false;
      });
    }
  }

  eliminarMadre(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.madreService.deleteMadre(id).subscribe(() => {
          this.loadMadres();
          Swal.fire('Eliminado', 'La madre ha sido eliminada con éxito.', 'success');
        });
      }
    });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
  }
}
