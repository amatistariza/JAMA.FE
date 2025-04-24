import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventarioSueroService } from '../../../services/inventario-suero.service';
import { Suero } from '../../../models/suero';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-inventario-suero',
  templateUrl: './gestion-inventario-suero.component.html',
  styleUrls: ['./gestion-inventario-suero.component.css']
})
export class GestionInventarioSueroComponent implements OnInit {
  sueros: Suero[] = [];
  suerosFiltrados: Suero[] = [];
  sueroSeleccionado: Suero | null = null;
  modoFormulario: 'crear' | 'editar' = 'crear';
  mostrarFormulario: boolean = false;
  sueroForm: FormGroup;

  itemsPorPagina: number = 5;
  paginaActual: number = 1;
  filtro: string = '';

  constructor(
    private sueroService: InventarioSueroService,
    private fb: FormBuilder
  ) {
    this.sueroForm = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      lote: ['', Validators.required],
      frascosDisponibles: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadSueros();
  }

  loadSueros(): void {
    this.sueroService.getSueros().subscribe({
      next: (sueros) => {
        this.sueros = sueros;
        this.suerosFiltrados = [...this.sueros];
      },
      error: (error) => {
        console.error('Error al cargar los sueros:', error);
      }
    });
  }

  filtrarSueros(): void {
    this.suerosFiltrados = this.sueros.filter((suero) =>
      suero.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
    this.paginaActual = 1;
  }

  addItem(): void {
    this.modoFormulario = 'crear';
    this.sueroSeleccionado = null;
    this.sueroForm.reset({
      id: 0,
      nombre: '',
      lote: '',
      frascosDisponibles: 0
    });
    this.mostrarFormulario = true;
  }

  editItem(suero: Suero): void {
    this.modoFormulario = 'editar';
    this.sueroSeleccionado = suero;
    this.sueroForm.patchValue({
      id: suero.id,
      nombre: suero.nombre,
      lote: suero.lote,
      frascosDisponibles: suero.frascosDisponibles
    });
    this.mostrarFormulario = true;
  }

  guardarSuero(): void {
    if (this.sueroForm.invalid) {
      Object.keys(this.sueroForm.controls).forEach(key => {
        const control = this.sueroForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const sueroData = this.sueroForm.value;

    if (this.modoFormulario === 'crear') {
      sueroData.id = 0;
      this.sueroService.addSuero(sueroData).subscribe({
        next: () => {
          this.loadSueros();
          this.mostrarFormulario = false;
          Swal.fire('Éxito', 'Suero agregado correctamente', 'success');
        },
        error: (error) => {
          console.error('Error al agregar suero:', error);
          Swal.fire('Error', 'No se pudo agregar el suero', 'error');
        }
      });
    } else if (this.modoFormulario === 'editar' && this.sueroSeleccionado) {
      this.sueroService.editSuero(this.sueroSeleccionado.id, sueroData).subscribe({
        next: () => {
          this.loadSueros();
          this.mostrarFormulario = false;
          Swal.fire('Éxito', 'Suero actualizado correctamente', 'success');
        },
        error: (error) => {
          console.error('Error al actualizar suero:', error);
          Swal.fire('Error', 'No se pudo actualizar el suero', 'error');
        }
      });
    }
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
        this.sueroService.deleteSuero(id).subscribe({
          next: () => {
            this.loadSueros();
            Swal.fire('Eliminado', 'El suero ha sido eliminado con éxito.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar suero:', error);
            Swal.fire('Error', 'No se pudo eliminar el suero', 'error');
          }
        });
      }
    });
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  cancelar(): void {
    this.mostrarFormulario = false;
  }
}
