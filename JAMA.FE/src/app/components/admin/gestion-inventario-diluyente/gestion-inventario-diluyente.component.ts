import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  diluyenteForm: FormGroup;

  itemsPorPagina: number = 5;
  paginaActual: number = 1;

  filtro: string = '';

  constructor(
    private diluyenteService: InventarioDiluyenteService,
    private fb: FormBuilder
  ) {
    this.diluyenteForm = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      lote: ['', Validators.required],
      cantidadDisponible: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadDiluyentes();
  }

  addItem(): void {
    this.modoFormulario = 'crear';
    this.diluyenteSeleccionada = null;
    this.diluyenteForm.reset({
      id: 0,
      nombre: '',
      lote: '',
      cantidadDisponible: 0
    });
    this.mostrarFormulario = true;
  }

  editItem(diluyente: Diluyente): void {
    this.modoFormulario = 'editar';
    this.diluyenteSeleccionada = diluyente;
    this.diluyenteForm.patchValue({
      id: diluyente.id,
      nombre: diluyente.nombre,
      lote: diluyente.lote,
      cantidadDisponible: diluyente.cantidadDisponible
    });
    this.mostrarFormulario = true;
  }

  guardarDiluyente(): void {
    if (this.diluyenteForm.invalid) {
      Object.keys(this.diluyenteForm.controls).forEach(key => {
        const control = this.diluyenteForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const diluyenteData = this.diluyenteForm.value;

    if (this.modoFormulario === 'crear') {
      // Asegurarse que sea un nuevo objeto para crear
      diluyenteData.id = 0;
      this.diluyenteService.addDiluyente(diluyenteData).subscribe({
        next: () => {
          this.loadDiluyentes();
          this.mostrarFormulario = false;
          Swal.fire('Éxito', 'Diluyente agregado correctamente', 'success');
        },
        error: (error) => {
          console.error('Error al agregar diluyente:', error);
          Swal.fire('Error', 'No se pudo agregar el diluyente', 'error');
        }
      });
    } else if (this.modoFormulario === 'editar' && this.diluyenteSeleccionada) {
      // Usar el ID del diluyente seleccionado para editar
      this.diluyenteService.editDiluyente(this.diluyenteSeleccionada.id, diluyenteData)
        .subscribe({
          next: () => {
            this.loadDiluyentes();
            this.mostrarFormulario = false;
            Swal.fire('Éxito', 'Diluyente actualizado correctamente', 'success');
          },
          error: (error) => {
            console.error('Error al actualizar diluyente:', error);
            Swal.fire('Error', 'No se pudo actualizar el diluyente', 'error');
          }
        });
    }
  }

  loadDiluyentes(): void {
    this.diluyenteService.getDiluyentes().subscribe({
      next: (diluyentes) => {
        console.log('Diluyentes cargados:', diluyentes); // Para debugging
        this.diluyentes = diluyentes;
        this.diluyentesFiltradas = [...this.diluyentes];
      },
      error: (error) => {
        console.error('Error al cargar los diluyentes:', error);
        Swal.fire('Error', 'No se pudieron cargar los diluyentes', 'error');
      }
    });
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
