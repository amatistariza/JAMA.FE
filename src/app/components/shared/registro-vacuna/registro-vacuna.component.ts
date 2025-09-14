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
import { PacienteService } from '../../../services/paciente.service';
import { EsquemaVacunacion } from '../../../models/esquema-vacunacion';

@Component({
  selector: 'app-registro-vacuna',
  templateUrl: './registro-vacuna.component.html',
  styleUrls: ['./registro-vacuna.component.css']
})
export class RegistroVacunaComponent implements OnInit {
  esquemas: EsquemaVacunacion[] = [];
  esquemaFiltrados: EsquemaVacunacion[] = [];
  itemsPorPagina: number = 5;
  paginaActual: number = 1;
  filtro: string = '';
  mostrarConsultaVacuna: boolean = true;
  mostrarRegistroVacuna: boolean = false;
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
    private pacienteService: PacienteService
  ) {
    this.esquemaForm = this.initForm(); // Inicializar aquí el formulario
    this.isEnfermera = this.router.url.includes('/enfermera/');
  }

  ngOnInit() {
    this.loadEsquemas();
    this.cargarInventarios();
    this.setResponsable();
  }

  private setResponsable() {
    const responsableInput = document.getElementById('responsableInput') as HTMLInputElement;
    const nombreUsuario = this.loginService.getTokenDecoded().sub || '';
    if (responsableInput) {
      responsableInput.value = nombreUsuario;
    }
    this.esquemaForm.patchValue({ responsable: nombreUsuario });
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
      detalles: this.fb.array([this.createDetalleFormGroup()]),
      numerodosis: ['']
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
      console.log("============");
      this.markFormGroupTouched(this.esquemaForm);
      this.mostrarCamposInvalidos(this.esquemaForm); // <-- Aquí muestra los campos inválidos
      Swal.fire('Error', 'Por favor complete todos los campos requeridos', 'error');

    }
  }
  private mostrarCamposInvalidos(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.mostrarCamposInvalidos(control);
      } else if (control instanceof FormArray) {
        (control as FormArray).controls.forEach((fg: any, idx: number) => {
          if (fg instanceof FormGroup) {
            this.mostrarCamposInvalidos(fg);
          }
        });
      } else {
        if (control && control.invalid) {
          console.log(
            `Campo inválido: ${key} | Valor leído: "${control.value}" | Errores: ${JSON.stringify(control.errors)}`
          );
        }
      }
    });
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
      detalleGroup.patchValue({ vacuna });
      this.esquemaForm.patchValue({ lote: vacuna.lote ?? '' });
      this.numeroDosisPorAplicar(vacunaId);
    } else {
      this.esquemaForm.patchValue({ lote: '' });
      this.esquemaForm.patchValue({ numerodosis: '' });
    }
  }

  numeroDosisPorAplicar(vacunaId: number): any {
    let response = this.esquemaService.getNumeroDosisPorAplicar(this.pacienteSeleccionado.id, vacunaId);
    response.subscribe(
      response => {
        if (response.aplica) {
          const numeroDosis = response.numeroDosis;
          this.esquemaForm.patchValue({ numerodosis: numeroDosis });
        } else {
          this.esquemaForm.patchValue({ numerodosis: '' });
          Swal.fire('Atención', response.mensaje, 'info');
        }
      },
      error => {
        console.error('Error al obtener el número de dosis por aplicar:', error);
        Swal.fire('Error', 'Ocurrió un problema al obtener el número de dosis por aplicar', 'error');
      }
    );
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

  addItem() {
    this.mostrarRegistroVacuna = true;
    this.mostrarConsultaVacuna = false;
  }

  back() {
    this.mostrarRegistroVacuna = false;
    this.mostrarConsultaVacuna = true;
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  loadEsquemas(): void {
    this.esquemaService.getEsquemas().subscribe(
      (esquemas) => {
        this.esquemas = esquemas;
        this.esquemaFiltrados = [...this.esquemas];
      },
      (error) => {
        console.error('Error al cargar los esquemas:', error);
        Swal.fire('Error', 'No se pudieron cargar los esquemas', 'error');
      }
    );
  }

  filtrarPacientes(): void {
    this.esquemaFiltrados = this.esquemas.filter((esquema) =>
      esquema.numeroIdentificacion.toString().includes(this.filtro)
    );
    this.paginaActual = 1;
  }

}
