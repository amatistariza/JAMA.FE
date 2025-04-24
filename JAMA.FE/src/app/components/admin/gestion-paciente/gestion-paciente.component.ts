import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../../services/paciente.service';
import { Paciente } from '../../../models/paciente';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-paciente',
  templateUrl: './gestion-paciente.component.html',
  styleUrls: ['./gestion-paciente.component.css']
})
export class GestionPacienteComponent implements OnInit {
  pacientes: Paciente[] = [];
  pacientesFiltradas: Paciente[] = [];
  pacienteSeleccionada: Paciente | null = null;
  modoFormulario: 'crear' | 'editar' = 'crear';
  mostrarFormulario: boolean = false;

  itemsPorPagina: number = 5;
  paginaActual: number = 1;

  filtro: string = '';

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.loadPacientes();
  }

  loadPacientes(): void {
    this.pacienteService.getPacientes().subscribe(
      (pacientes) => {
        this.pacientes = pacientes;
        this.pacientesFiltradas = [...this.pacientes];
      },
      (error) => {
        console.error('Error al cargar los pacientes:', error);
        Swal.fire('Error', 'No se pudieron cargar los pacientes', 'error');
      }
    );
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  filtrarPacientes(): void {
    this.pacientesFiltradas = this.pacientes.filter((paciente) =>
      paciente.numeroIdentificacion.toString().includes(this.filtro)
    );
    this.paginaActual = 1;
  }

  addItem(): void {
    this.modoFormulario = 'crear';
    this.pacienteSeleccionada = this.inicializarPaciente();
    this.mostrarFormulario = true;
  }

  editItem(paciente: Paciente): void {
    this.modoFormulario = 'editar';
    this.pacienteSeleccionada = { ...paciente };
    this.mostrarFormulario = true;
  }  

  guardarPaciente(paciente: Paciente): void {
    const request = this.modoFormulario === 'crear' 
      ? this.pacienteService.addPaciente(paciente) 
      : this.pacienteService.editPaciente(paciente.id, paciente);

    request.subscribe(
      () => {
        this.loadPacientes();
        this.mostrarFormulario = false;
        Swal.fire('Éxito', 'Paciente guardado correctamente', 'success');
      },
      (error) => {
        console.error('Error al guardar el paciente:', error);
        Swal.fire('Error', 'No se pudo guardar el paciente', 'error');
      }
    );
  }

  eliminarPaciente(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.pacienteService.deletePaciente(id).subscribe(
          () => {
            this.loadPacientes();
            Swal.fire('Eliminado', 'El paciente ha sido eliminado con éxito.', 'success');
          },
          (error) => {
            console.error('Error al eliminar el paciente:', error);
            Swal.fire('Error', 'No se pudo eliminar el paciente', 'error');
          }
        );
      }
    });
  }

  cancelar(): void {
    this.mostrarFormulario = false;
  }

  private inicializarPaciente(): Paciente {
    return {
      id: 0,
      fechaAtencion: new Date().toISOString(),
      tipoIdentificacion: '',
      numeroIdentificacion: '', // Cambiar a string
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
      indicativoTelefono: '', // Cambiar a string
      telefonoFijo: '', // Cambiar a string
      celular: '', // Cambiar a string
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
}