import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventarioJeringaService } from '../../../services/inventario-jeringa.service';
import { Jeringa } from '../../../models/jeringa';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-inventario-jeringa',
  templateUrl: './gestion-inventario-jeringa.component.html',
  styleUrls: ['./gestion-inventario-jeringa.component.css']
})
export class GestionInventarioJeringaComponent implements OnInit {
  jeringas: Jeringa[] = [];
  jeringasFiltradas: Jeringa[] = [];
  jeringaSeleccionada: Jeringa | null = null;
  modoFormulario: 'crear' | 'editar' = 'crear';
  mostrarFormulario: boolean = false;
  jeringaForm: FormGroup;

  itemsPorPagina: number = 5;
  paginaActual: number = 1;
  filtro: string = '';

  constructor(
    private jeringaService: InventarioJeringaService,
    private fb: FormBuilder
  ) {
    this.jeringaForm = this.fb.group({
      id: [0],
      tipo: ['', Validators.required],
      lote: ['', Validators.required],
      cantidadDisponible: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadJeringas();
  }

  loadJeringas(): void {
    this.jeringaService.getJeringas().subscribe({
      next: (jeringas) => {
        this.jeringas = jeringas;
        this.jeringasFiltradas = [...this.jeringas];
      },
      error: (error) => {
        console.error('Error al cargar jeringas:', error);
        Swal.fire('Error', 'No se pudieron cargar las jeringas', 'error');
      }
    });
  }

  filtrarJeringas(): void {
    this.jeringasFiltradas = this.jeringas.filter((jeringa) =>
      jeringa.tipo.toLowerCase().includes(this.filtro.toLowerCase())
    );
    this.paginaActual = 1;
  }

  addItem(): void {
    this.modoFormulario = 'crear';
    this.jeringaSeleccionada = null;
    this.jeringaForm.reset({
      id: 0,
      tipo: '',
      lote: '',
      cantidadDisponible: 0
    });
    this.mostrarFormulario = true;
  }

  editItem(jeringa: Jeringa): void {
    this.modoFormulario = 'editar';
    this.jeringaSeleccionada = jeringa;
    this.jeringaForm.patchValue({
      id: jeringa.id,
      tipo: jeringa.tipo,
      lote: jeringa.lote,
      cantidadDisponible: jeringa.cantidadDisponible
    });
    this.mostrarFormulario = true;
  }

  guardarJeringa(): void {
    if (this.jeringaForm.invalid) {
      Object.keys(this.jeringaForm.controls).forEach(key => {
        const control = this.jeringaForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const jeringaData = this.jeringaForm.value;

    if (this.modoFormulario === 'crear') {
      jeringaData.id = 0;
      this.jeringaService.addJeringa(jeringaData).subscribe({
        next: () => {
          this.loadJeringas();
          this.mostrarFormulario = false;
          Swal.fire('Éxito', 'Jeringa agregada correctamente', 'success');
        },
        error: (error) => {
          console.error('Error al agregar jeringa:', error);
          Swal.fire('Error', 'No se pudo agregar la jeringa', 'error');
        }
      });
    } else if (this.modoFormulario === 'editar' && this.jeringaSeleccionada) {
      this.jeringaService.editJeringa(this.jeringaSeleccionada.id, jeringaData).subscribe({
        next: () => {
          this.loadJeringas();
          this.mostrarFormulario = false;
          Swal.fire('Éxito', 'Jeringa actualizada correctamente', 'success');
        },
        error: (error) => {
          console.error('Error al actualizar jeringa:', error);
          Swal.fire('Error', 'No se pudo actualizar la jeringa', 'error');
        }
      });
    }
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
        this.jeringaService.deleteJeringa(id).subscribe({
          next: () => {
            this.loadJeringas();
            Swal.fire('Eliminado', 'La jeringa ha sido eliminada con éxito.', 'success');
          },
          error: (error) => {
            if (error.status === 500 && error.error.includes('FK_')) {
              Swal.fire(
                'Error',
                'No se puede eliminar esta jeringa porque está siendo utilizada en registros de vacunación.',
                'error'
              );
            } else {
              Swal.fire(
                'Error',
                'Ha ocurrido un error al intentar eliminar la jeringa.',
                'error'
              );
            }
          }
        });
      }
    });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
  }
}
