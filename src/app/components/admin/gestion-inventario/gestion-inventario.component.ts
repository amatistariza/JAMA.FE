import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  vacunaForm: FormGroup;

  constructor(
    private vacunaService: InventarioVacunaService,
    private fb: FormBuilder
  ) {
    this.vacunaForm = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      laboratorio: ['', Validators.required],
      lote: ['', Validators.required],
      dosisDisponibles: [0, [Validators.required, Validators.min(0)]],
      numeroDosis: [1, [Validators.required, Validators.min(1)]],
      intervaloSemanas: [0, [Validators.required, Validators.min(0)]],
      fechaRegistro: [new Date()]
    });
  }

  // Paginación
  itemsPorPagina: number = 5;
  paginaActual: number = 1;

  // Filtro
  filtro: string = '';

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
    this.vacunaForm.reset({
      id: 0,
      nombre: '',
      laboratorio: '',
      lote: '',
      dosisDisponibles: 0,
      numeroDosis: 1,
      intervaloSemanas: 0,
      fechaRegistro: new Date()
    });
    this.mostrarFormulario = true;
  }

  editItem(vacuna: Vacuna): void {
    this.modoFormulario = 'editar';
    this.vacunaForm.patchValue({
      id: vacuna.id,
      nombre: vacuna.nombre,
      laboratorio: vacuna.laboratorio,
      lote: vacuna.lote,
      dosisDisponibles: vacuna.dosisDisponibles,
      numeroDosis: vacuna.numeroDosis ?? 1,
      intervaloSemanas: vacuna.intervaloSemanas ?? 0,
      fechaRegistro: vacuna.fechaRegistro
    });
    this.mostrarFormulario = true;
  }

  guardarVacuna(): void {
    if (this.vacunaForm.invalid) {
      Object.keys(this.vacunaForm.controls).forEach(key => {
        const control = this.vacunaForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const vacuna: Vacuna = this.vacunaForm.value;

    if (this.modoFormulario === 'crear') {
      this.vacunaService.addVacuna(vacuna).subscribe({
        next: () => {
          this.loadVacunas();
          this.mostrarFormulario = false;
          Swal.fire('Éxito', 'Vacuna agregada correctamente', 'success');
        },
        error: (error) => {
          console.error('Error al agregar vacuna:', error);
          Swal.fire('Error', 'No se pudo agregar la vacuna', 'error');
        }
      });
    } else {
      this.vacunaService.editVacuna(vacuna.id, vacuna).subscribe({
        next: () => {
          this.loadVacunas();
          this.mostrarFormulario = false;
          Swal.fire('Éxito', 'Vacuna actualizada correctamente', 'success');
        },
        error: (error) => {
          console.error('Error al actualizar vacuna:', error);
          Swal.fire('Error', 'No se pudo actualizar la vacuna', 'error');
        }
      });
    }
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
        this.vacunaService.deleteVacuna(id).subscribe({
          next: () => {
            this.loadVacunas();
            Swal.fire('Eliminado', 'La vacuna ha sido eliminada con éxito.', 'success');
          },
          error: (error) => {
            if (error.status === 500 && error.error.includes('FK_EsquemaVacunacionDetalles_Vacunas_VacunaId')) {
              Swal.fire(
                'Error',
                'No se puede eliminar esta vacuna porque está siendo utilizada en esquemas de vacunación.',
                'error'
              );
            } else {
              Swal.fire(
                'Error',
                'Ha ocurrido un error al intentar eliminar la vacuna.',
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