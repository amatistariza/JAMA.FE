import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Paciente } from '../../../../models/paciente';
import { Madre } from '../../../../models/madre';
import { Cuidador } from '../../../../models/cuidador';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { PacienteService } from '../../../../services/paciente.service';
import { MadreService } from '../../../../services/madre.service';
import { CuidadorService } from '../../../../services/cuidador.service';
import { ValidationMessages } from '../../../shared/form-validation-messages';
;

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Input() paciente: Paciente = this.inicializarPaciente();
  @Output() onGuardar = new EventEmitter<Paciente>();
  @Output() onCancelar = new EventEmitter<void>();

  pacienteForm: FormGroup;
  step: number = 1;
  mostrarTablaMadre = false;
  mostrarTablaCuidador = false;

  madreSeleccionada: Madre | null = null;
  cuidadorSeleccionado: Cuidador | null = null;
  madreSeleccionadaNombre: string = '';
  cuidadorSeleccionadoNombre: string = '';

  constructor(private fb: FormBuilder,
    private pacienteService: PacienteService,
    private madreService: MadreService,
    private cuidadorService: CuidadorService) { }

  ngOnInit(): void {

    this.pacienteForm = this.fb.group({
      numeroIdentificacion: [
        '',
        [
          Validators.required,
          Validators.minLength(7),   // ✅ mínimo 7 dígitos
          Validators.pattern(/^\d+$/) // ✅ solo números
        ]
      ]
    });

    this.pacienteForm = this.fb.group({
      tipoIdentificacion: [''],
      numeroIdentificacion: ['', [Validators.required]],
      primerNombre: [''],
      segundoNombre: [''],
      primerApellido: [''],
      segundoApellido: [''],
      fechaNacimiento: [this.formatFecha(new Date())],
      esquemaCompleto: [true],
      sexo: [''],
      genero: [''],
      orientacionSexual: [''],
      edadGestacionalSemanas: [0],
      paisNacimiento: [''],
      estatusMigratorio: [''],
      lugarAtencionParto: ['ISABEL'],
      regimenAfiliacion: [''],
      aseguradora: [''],
      pertenenciaEtnica: [''],
      desplazado: [false],
      discapacitado: [false],
      fallecido: [false],
      victimaConflictoArmado: [false],
      estudiaActualmente: [false],
      paisResidencia: [''],
      departamentoResidencia: [''],
      municipioResidencia: [''],
      comunaLocalidad: [''],
      area: [''],
      direccion: [''],
      indicativoTelefono: ['', [Validators.required]],
      telefonoFijo: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      email: [''],
      autorizaLlamadasTelefonicas: [false],
      autorizaEnvioCorreo: [false],
      antecedentes: this.fb.array([]),
      madreId: [0],
      cuidadorId: [0],
      condicionUsuaria: this.fb.group({
        condicion: [''],
        gestante: [false],
        fechaUltimaMenstruacion: [this.formatFecha(new Date())],
        semanasGestacion: [0],
        fechaProbableParto: [this.formatFecha(new Date())],
        cantidadEmbarazosPrevios: [0]
      }),
      antecedentesMedicos: this.fb.group({
        contraindicacionVacunacion: [false],
        detalleContraindicacion: [''],
        reaccionBiologicos: [false],
        detalleReaccion: ['']
      })
    });

    this.antecedentes.push(this.fb.group({
      fechaRegistro: [this.formatFecha(new Date())],
      tipo: [''],
      descripcion: [''],
      observacionesEspeciales: ['']
    }));

    if (this.modo === 'editar') {
      this.cargarDatos();
    }
  }

  inicializarPaciente(): Paciente {
    return {
      id: 0,
      fechaAtencion: new Date().toISOString(),
      tipoIdentificacion: '',
      numeroIdentificacion: '',
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      fechaNacimiento: new Date().toISOString(),
      esquemaCompleto: true,
      sexo: '',
      genero: '',
      orientacionSexual: '',
      edadGestacionalSemanas: 0,
      paisNacimiento: '',
      estatusMigratorio: '',
      lugarAtencionParto: '',
      regimenAfiliacion: '',
      aseguradora: '',
      pertenenciaEtnica: '',
      desplazado: false,
      discapacitado: false,
      fallecido: false,
      victimaConflictoArmado: false,
      estudiaActualmente: false,
      paisResidencia: '',
      departamentoResidencia: '',
      municipioResidencia: '',
      comunaLocalidad: '',
      area: '',
      direccion: '',
      indicativoTelefono: '',
      telefonoFijo: '',
      celular: '',
      email: 'user@example.com',
      autorizaLlamadasTelefonicas: false,
      autorizaEnvioCorreo: false,
      antecedentes: [{
        id: 0,
        fechaRegistro: new Date().toISOString(),
        tipo: '',
        descripcion: '',
        observacionesEspeciales: '',
        paciente: ''
      }],
      madreId: 0,
      cuidadorId: 0,
      condicionUsuaria: {
        id: 0,
        condicion: '',
        gestante: false,
        fechaUltimaMenstruacion: new Date().toISOString(),
        semanasGestacion: 0,
        fechaProbableParto: new Date().toISOString(),
        cantidadEmbarazosPrevios: 0,
        paciente: ''
      },
      antecedentesMedicos: {
        id: 0,
        contraindicacionVacunacion: false,
        detalleContraindicacion: '',
        reaccionBiologicos: false,
        detalleReaccion: '',
        paciente: ''
      }
    };
  }

  get mayorDe18(): boolean {
    const fecha = this.pacienteForm.get('fechaNacimiento')?.value;
    if (!fecha) return false;
    const nacimiento = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad >= 18;
  }

  cargarDatos() {
    // Asegúrate de que la fecha de nacimiento ya esté en el formato correcto para el input
    this.pacienteForm.patchValue({
      ...this.paciente,
      fechaNacimiento: this.paciente.fechaNacimiento ? this.formatFecha(new Date(this.paciente.fechaNacimiento)) : ''
    });
    this.cargarAntecedentes(this.paciente.antecedentes || []);

    if (this.paciente.madreId) {
      this.cargarMadre(this.paciente.madreId);  // Se mantiene sin cambios
    }

    if (this.paciente.cuidadorId) {
      this.cargarCuidador(this.paciente.cuidadorId);
    }
  }

  // Método para cargar la madre con los datos completos
  cargarMadre(madreId: number): void {
    this.madreService.getMadreById(madreId).subscribe(
      (madre) => {
        this.madreSeleccionada = madre;
        this.pacienteForm.patchValue({ madreId: madre.id });

        // Nueva variable para manejar el nombre completo de la madre
        this.madreSeleccionadaNombre = `${madre.primerNombre} ${madre.segundoNombre || ''} ${madre.primerApellido} ${madre.segundoApellido || ''}`;
      },
      (error) => console.error('Error al cargar la madre:', error)
    );
  }

  // Carga la información del cuidador usando el servicio
  cargarCuidador(cuidadorId: number): void {
    this.cuidadorService.getCuidadorById(cuidadorId).subscribe(
      (cuidador) => {
        this.cuidadorSeleccionado = cuidador;
        this.pacienteForm.patchValue({ cuidadorId: cuidador.id });

        this.cuidadorSeleccionadoNombre = `${cuidador.primerNombre} ${cuidador.segundoNombre || ''} ${cuidador.primerApellido} ${cuidador.segundoApellido || ''}`;
      },
      (error) => console.error('Error al cargar el cuidador:', error)
    );
  }

  cargarAntecedentes(antecedentes: any[]) {
    const antecedentesFormArray = this.pacienteForm.get('antecedentes') as FormArray;
    antecedentes.forEach(antecedente => {
      antecedentesFormArray.push(this.fb.group({
        fechaRegistro: [antecedente.fechaRegistro || new Date().toISOString()],
        tipo: [antecedente.tipo || ''],
        descripcion: [antecedente.descripcion || ''],
        observacionesEspeciales: [antecedente.observacionesEspeciales || '']
      }));
    });
  }

  get antecedentes(): FormArray {
    return this.pacienteForm.get('antecedentes') as FormArray;
  }

  agregarAntecedente() {
    this.antecedentes.push(this.fb.group({
      fechaRegistro: [new Date().toISOString()],
      tipo: [''],
      descripcion: [''],
      observacionesEspeciales: ['']
    }));
  }

  quitarAntecedente(index: number) {
    this.antecedentes.removeAt(index);
  }

  // Método para quitar la selección de la madre
  quitarSeleccionMadre() {
    this.madreSeleccionada = null;
    this.madreSeleccionadaNombre = '';  // Limpiamos el nombre completo
    this.pacienteForm.patchValue({
      madreId: 0
    });
  }

  // Método para seleccionar una nueva madre
  seleccionarMadre(madre: Madre): void {
    this.madreSeleccionada = madre;
    this.madreSeleccionadaNombre = `${madre.primerNombre} ${madre.segundoNombre || ''} ${madre.primerApellido} ${madre.segundoApellido || ''}`;  // Asignar el nombre completo
    this.paciente.madreId = madre.id;
    this.pacienteForm.patchValue({
      madreId: madre.id
    });
    this.mostrarTablaMadre = false;  // Cerrar la tabla de selección de madre
  }

  // Método para quitar la selección del cuidador
  quitarSeleccionCuidador(): void {
    this.cuidadorSeleccionado = null;
    this.pacienteForm.patchValue({
      cuidadorId: 0
    });
  }

  // Método para seleccionar un nuevo cuidador
  seleccionarCuidador(cuidador: Cuidador): void {
    this.cuidadorSeleccionado = cuidador;
    this.cuidadorSeleccionadoNombre = `${cuidador.primerNombre} ${cuidador.segundoNombre || ''} ${cuidador.primerApellido} ${cuidador.segundoApellido || ''}`;
    this.paciente.cuidadorId = cuidador.id;
    this.pacienteForm.patchValue({
      cuidadorId: cuidador.id
    });
    this.mostrarTablaCuidador = false;
  }

  volverAlFormulario() {
    this.mostrarTablaMadre = false;
    this.mostrarTablaCuidador = false;
  }

  nextStep() {
    if (this.step < 9) {
      this.step++;
    }
  }

  previousStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  formatFecha(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; // Formato: YYYY-MM-DD
  }

  validaciones(): any {

    // Asignar los IDs de madre y cuidador si están seleccionados
    if (this.madreSeleccionada) {
      this.paciente.madreId = this.madreSeleccionada.id;
    }

    if (this.cuidadorSeleccionado) {
      this.paciente.cuidadorId = this.cuidadorSeleccionado.id;
    }

    // Validar antecedentes y asignar valores predeterminados si no hay datos
    let antecedentes = this.pacienteForm.get('antecedentes')?.value;

    // Si no hay antecedentes, asignamos un objeto vacío con valores predeterminados
    if (!antecedentes || antecedentes.length === 0) {
      antecedentes = [{
        Tipo: 'No disponible',  // Valor predeterminado
        Descripcion: 'No disponible',  // Valor predeterminado
        observacionesEspeciales: 'No disponible'
      }];
    } else {
      // Aseguramos que cada antecedente tiene los valores de 'Tipo' y 'Descripcion'
      antecedentes = antecedentes.map((antecedente: any) => ({
        Tipo: antecedente.Tipo || 'No disponible',  // Valor predeterminado si está vacío
        Descripcion: antecedente.Descripcion || 'No disponible',  // Valor predeterminado si está vacío
        observacionesEspeciales: antecedente.observacionesEspeciales || 'No disponible',
        pacienteId: this.paciente.id,
        fechaRegistro: antecedente.fechaRegistro
          ? new Date(antecedente.fechaRegistro).toISOString()
          : new Date().toISOString()
      }));
    }

    // Construir el objeto JSON para enviar
    const pacienteJson: Paciente = {
      id: this.paciente.id,
      ...this.pacienteForm.value,
      antecedentes: antecedentes,  // Enviar antecedentes con valores predeterminados si es necesario
      condicionUsuaria: this.pacienteForm.get('condicionUsuaria')?.value.condicion
        ? this.pacienteForm.get('condicionUsuaria')?.value
        : null,  // Enviar null si no hay condicionUsuaria
      antecedentesMedicos: this.pacienteForm.get('antecedentesMedicos')?.value.detalleContraindicacion
        ? this.pacienteForm.get('antecedentesMedicos')?.value
        : null,  // Enviar null si no hay antecedentesMedicos
      fechaAtencion: new Date().toISOString(),
    };

    return pacienteJson;
  }

  async exitePaciente(pacienteJson): Promise<boolean> {
    try {
      const paciente2 = await this.pacienteService.getPacienteByNumeroIdentificacion(pacienteJson.numeroIdentificacion).toPromise();
      console.log('Verificando existencia del paciente con número de identificación:', paciente2);
      if (paciente2) {
        console.log('Paciente encontrado:', paciente2);
        return true;
      } else {
        console.log('No se encontró ningún paciente con ese número de identificación.');
        return false;

      }
    } catch (error) {
      console.error('Error al verificar la existencia del paciente:', error);
      return true;

    }
  }

  validarcampos(): boolean {
    return (
      this.pacienteForm.get('tipoIdentificacion')?.invalid ||
      this.pacienteForm.get('numeroIdentificacion')?.invalid ||
      this.pacienteForm.get('primerNombre')?.invalid ||
      this.pacienteForm.get('primerApellido')?.invalid ||
      this.pacienteForm.get('segundoApellido')?.invalid ||
      this.pacienteForm.get('fechaNacimiento')?.invalid ||
      this.pacienteForm.get('estatusMigratorio')?.invalid ||
      this.pacienteForm.get('sexo')?.invalid ||
      this.pacienteForm.get('orientacionSexual')?.invalid ||
      this.pacienteForm.get('paisResidencia')?.invalid ||
      this.pacienteForm.get('departamentoResidencia')?.invalid ||
      this.pacienteForm.get('municipioResidencia')?.invalid ||
      this.pacienteForm.get('direccion')?.invalid ||
      this.pacienteForm.get('email')?.invalid ||
      this.pacienteForm.get('telefonoFijo')?.invalid ||
      this.pacienteForm.get('celular')?.invalid ||
      this.pacienteForm.get('pertenenciaEtnica')?.invalid
    );
  }

  esMenorQueSiete(): boolean {
    const valor: string = this.pacienteForm.get('numeroIdentificacion')?.value;
    return valor !== null && valor !== undefined && valor.toString().length < 7;
  }

  async guardar(): Promise<void> {
    if (this.esMenorQueSiete()) {
      Swal.fire('Error', 'El número de identificación es menor de 7 digitos', 'error');
    } else {
      if (this.validarcampos()) {
        Swal.fire('Error', 'Por favor, completa todos los campos obligatorios.', 'error');
      } else {
        const pacienteJson = this.validaciones();
        if (this.modo === 'crear') {
          const existe = await this.exitePaciente(pacienteJson);
          if (existe) {
            Swal.fire('Error', 'Ya existe un paciente con este número de identificación', 'error');
          } else {
            this.guardarPaciente(pacienteJson);
          }
        } else {
          this.editarPaciente(pacienteJson);
        }
      }
    }

  }

  editarPaciente(pacienteJson: Paciente): void {
    const request = this.pacienteService.editPaciente(this.paciente.id, pacienteJson);

    request.subscribe(
      response => {
        Swal.fire('Éxito', this.modo === 'crear' ? 'Paciente guardado correctamente' : 'Paciente actualizado correctamente', 'success');
        this.onGuardar.emit(pacienteJson);
        this.onCancelar.emit();
      },
      error => {
        Swal.fire('Error', 'Hubo un problema al guardar o actualizar el paciente', 'error');
        console.error('Error:', error);
      }
    );

  }


  guardarPaciente(pacienteJson: Paciente): void {
    const request = this.pacienteService.addPaciente(pacienteJson)
    request.subscribe(
      response => {
        Swal.fire('Éxito', this.modo === 'crear' ? 'Paciente guardado correctamente' : 'Paciente actualizado correctamente', 'success');
        this.onGuardar.emit(pacienteJson);
        this.onCancelar.emit();
      },
      error => {
        Swal.fire('Error', 'Hubo un problema al guardar o actualizar el paciente', 'error');
        console.error('Error:', error);
      }
    );


  }

  getErrorMessage(fieldName: string): string {
    const control = this.pacienteForm.get(fieldName);
    if (control && control.errors) {
      const firstError = Object.keys(control.errors)[0];
      return ValidationMessages[firstError as keyof typeof ValidationMessages];
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.pacienteForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

    ValidationMessages = {
    required: 'El número de identificación es obligatorio',
    minlength: 'Debe tener mínimo 7 dígitos',
    pattern: 'Solo se permiten números'
  };




  cancelar(): void {
    Swal.fire({
      title: '¿Deseas salir este usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.onCancelar.emit();
      }
    });
  }
}