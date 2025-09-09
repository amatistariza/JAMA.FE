import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EsquemaVacunacionService } from '../../../services/esquema-vacunacion.service';
import { InventarioVacunaService } from '../../../services/inventario-vacuna.service';
import { InventarioJeringaService } from '../../../services/inventario-jeringa.service';
import { InventarioDiluyenteService } from '../../../services/inventario-diluyente.service';

import { LoginService } from '../../../services/login.service';
import { Paciente } from '../../../models/paciente';
import Swal from 'sweetalert2';
import { ValidationMessages } from '../form-validation-messages';
import { Vacuna } from '../../../models/vacuna';
import { PacienteService } from '../../../services/paciente.service';

@Component({
  selector: 'app-registro-vacuna',
  templateUrl: './registro-vacuna.component.html',
  styleUrls: ['./registro-vacuna.component.css']
})
export class RegistroVacunaComponent implements OnInit {
  esquemaForm: FormGroup;
  isEnfermera: boolean = false;
  formMessage: string = '';
  formStatus: 'success' | 'error' | '' = '';
  pacienteSeleccionado: Paciente | null = null;
  vacunas: any[] = [];
  jeringas: any[] = [];
  diluyentes: any[] = [];
  searchTerm: string = '';
  mensajeBusqueda: string = '';
  mensajeBusquedaClass: string = '';
  pacienteEncontrado: boolean = false;
  viasAplicacion: string[] = [
    'Intramuscular',
    'Subcutánea',
    'Intradérmica',
    'Oral',
    'Nasal'
  ];
  sitiosAplicacion: string[] = [
    'Brazo Derecho',
    'Brazo Izquierdo',
    'Muslo Derecho',
    'Muslo Izquierdo',
    'Glúteo Derecho',
    'Glúteo Izquierdo',
    'Oral',
    'Nasal'
  ];

  constructor(
    private fb: FormBuilder,
    private esquemaService: EsquemaVacunacionService,
    private inventarioVacunaService: InventarioVacunaService,
    private inventarioJeringaService: InventarioJeringaService,
    private inventarioDiluyenteService: InventarioDiluyenteService,
    private router: Router,
    private loginService: LoginService,
    private pacienteService: PacienteService // Agregamos el servicio
  ) {
    this.esquemaForm = this.initForm(); // Inicializar aquí el formulario
    this.isEnfermera = this.router.url.includes('/enfermera/');
  }

  ngOnInit() {
    this.cargarInventarios();
  }

  cargarInventarios() {
    this.inventarioVacunaService.getVacunas().subscribe(
      data => this.vacunas = data
    );
    this.inventarioJeringaService.getJeringas().subscribe(
      data => this.jeringas = data
    );
    this.inventarioDiluyenteService.getDiluyentes().subscribe(
      data => this.diluyentes = data
    );
  }

  private initForm(): FormGroup {
    return this.fb.group({
      tipoCarnet: ['', Validators.required],
      responsable: ['', Validators.required],
      registradoPAI: [false], // Asegurarnos que se inicializa como booleano
      motivoIngreso: [''],
      observaciones: [''],
      pacienteId: ['', Validators.required],
      viaDeAdministracion: ['Intramuscular', [Validators.required]], // Valor por defecto
      sitioDeAplicacion: ['Brazo Derecho', [Validators.required]], // Valor por defecto
      lote: [''],
      detalles: this.fb.array([this.createDetalleFormGroup()])
    });
  }

  createDetalleFormGroup(): FormGroup {
    return this.fb.group({
      vacunaId: ['', [Validators.required]],
      vacuna: [null],
      registradoPAI: [false],
      cantidadUtilizadaVacuna: [1, [Validators.required, Validators.min(1)]],
      diluyenteId: [''],
      diluyente: [null],
      cantidadUtilizadaDiluyente: [0],
      jeringaId: ['', [Validators.required]],
      jeringa: [null],
      cantidadUtilizadaJeringa: [1, [Validators.required, Validators.min(1)]],
      dosis: ['', [Validators.required]],
    });
  }

  get detalles(): FormArray {
    return this.esquemaForm.get('detalles') as FormArray;
  }

  agregarDetalle(): void {
    this.detalles.push(this.createDetalleFormGroup());
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.esquemaForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.esquemaForm.get(fieldName);
    if (control && control.errors) {
      const firstError = Object.keys(control.errors)[0];
      return ValidationMessages[firstError as keyof typeof ValidationMessages];
    }
    return '';
  }

  guardarEsquema(): void {
    if (this.esquemaForm.valid) {
      const userId = this.loginService.getUserIdFromToken();
      const esquemaData = {
        ...this.esquemaForm.value,
        numeroDeDosis: 1,
        usuarioId: userId,
        estado: 'ACTIVO',


      };

      console.log(esquemaData)


      this.esquemaService.crearEsquema(esquemaData).subscribe({
        next: (response) => {
          Swal.fire('Éxito', 'Esquema guardado correctamente', 'success')
            .then(() => {
              const parsed = JSON.parse(response); // convertir string -> objeto
              const esquemaId = parsed.esquemaId;
              console.log('EsquemaId:', esquemaId);
              const baseRoute = this.isEnfermera ? 'enfermera' : 'admin';
              this.router.navigate([`/${baseRoute}/${userId}/esquema-detalles/${esquemaId}`]);
            });
        },
        error: (error) => {
          console.error('Error al guardar:', error);
          Swal.fire('Error', 'No se pudo guardar el esquema: 1' + error.message, 'error');
        }
      });
    } else {
      this.markFormGroupTouched(this.esquemaForm);
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private showMessage(message: string, status: 'success' | 'error'): void {
    this.formMessage = message;
    this.formStatus = status;
    setTimeout(() => {
      this.formMessage = '';
      this.formStatus = '';
    }, 3000);
  }

  onPacienteSelected(paciente: Paciente) {
    this.pacienteSeleccionado = paciente;
    this.esquemaForm.patchValue({
      pacienteId: paciente.id
    });
  }

  onVacunaSelect(event: any, index: number) {
    const vacunaId = +event.target.value;
    const vacuna = this.vacunas.find(v => v.id === vacunaId);
    const detalleGroup = this.detalles.at(index) as FormGroup;

    if (vacuna) {
      detalleGroup.patchValue({ vacuna }); // opcional
      this.esquemaForm.patchValue({ lote: vacuna.lote ?? '' });  // 👈 root
    } else {
      this.esquemaForm.patchValue({ lote: '' });
    }
  }




  onDiluyenteSelect(event: any, index: number) {
    const diluyente = this.diluyentes.find(d => d.id === +event.target.value);
    if (diluyente) {
      const detalleGroup = (this.detalles.at(index) as FormGroup);
      detalleGroup.patchValue({
        diluyente: diluyente,
        cantidadUtilizadaDiluyente: 1 // Valor por defecto
      });
    }
  }



  buscarPaciente(): void {
    if (this.searchTerm.length >= 3) {
      this.mensajeBusqueda = 'Buscando paciente...';
      this.mensajeBusquedaClass = 'alert alert-info';

      this.pacienteService.getPacienteByNumeroIdentificacion(this.searchTerm)
        .subscribe({
          next: (paciente) => {
            if (paciente) {
              this.pacienteEncontrado = true;
              this.mensajeBusqueda = `Paciente encontrado: ${paciente.primerNombre} ${paciente.primerApellido}`;
              this.mensajeBusquedaClass = 'alert alert-success';
              this.onPacienteSelected(paciente);
            }
          },
          error: (error) => {
            this.pacienteEncontrado = false;
            this.pacienteSeleccionado = null;
            this.mensajeBusqueda = 'Paciente no encontrado. Haga clic en "Registrar" para crear uno nuevo.';
            this.mensajeBusquedaClass = 'alert alert-warning';
            this.esquemaForm.get('pacienteId')?.setValue(null);
          }
        });
    } else if (this.searchTerm.length > 0) {
      this.pacienteEncontrado = false;
      this.pacienteSeleccionado = null;
      this.mensajeBusqueda = 'Digite al menos 3 caracteres...';
      this.mensajeBusquedaClass = 'alert alert-info';
    } else {
      this.limpiarBusqueda();
    }
  }

  private limpiarBusqueda(): void {
    this.mensajeBusqueda = '';
    this.pacienteEncontrado = false;
    this.pacienteSeleccionado = null;
    this.esquemaForm.get('pacienteId')?.setValue(null);
  }

  irARegistro(): void {
    const userId = this.loginService.getUserIdFromToken();
    if (userId) {
      const baseRoute = this.isEnfermera ? 'enfermera' : 'admin';
      this.router.navigate([`/${baseRoute}/${userId}/gestionPaciente`]).then(success => {
        if (!success) {
          console.error('Error en la navegación');
          Swal.fire('Error', 'No se pudo navegar al registro de pacientes', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'No se pudo obtener el ID del usuario', 'error');
    }
  }
}
