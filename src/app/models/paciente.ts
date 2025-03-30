export interface Paciente {
  id: number;
  fechaAtencion: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string; // cambiado a string
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  esquemaCompleto: boolean;
  sexo: string;
  genero: string;
  orientacionSexual: string;
  edadGestacionalSemanas: number;
  paisNacimiento: string;
  estatusMigratorio: string;
  lugarAtencionParto: string;
  regimenAfiliacion: string;
  aseguradora: string;
  pertenenciaEtnica: string;
  desplazado: boolean;
  discapacitado: boolean;
  fallecido: boolean;
  victimaConflictoArmado: boolean;
  estudiaActualmente: boolean;
  paisResidencia: string;
  departamentoResidencia: string;
  municipioResidencia: string;
  comunaLocalidad: string;
  area: string;
  direccion: string;
  indicativoTelefono: string; // cambiado a string
  telefonoFijo: string; // cambiado a string
  celular: string; // cambiado a string
  email: string;
  autorizaLlamadasTelefonicas: boolean;
  autorizaEnvioCorreo: boolean;
  antecedentes: Antecedente[];
  madreId: number;
  cuidadorId: number;
  condicionUsuaria: CondicionUsuaria;
  antecedentesMedicos: AntecedenteMedico;
}

export interface Antecedente {
  id: number;
  fechaRegistro: string;
  tipo: string;
  descripcion: string;
  observacionesEspeciales: string;
  paciente: string;
  pacienteId?: number; // Opcional para compatibilidad con el backend
}

export interface CondicionUsuaria {
  id: number;
  condicion: string;
  gestante: boolean;
  fechaUltimaMenstruacion: string;
  semanasGestacion: number;
  fechaProbableParto: string;
  cantidadEmbarazosPrevios: number;
  paciente: string;
  pacienteId?: number; // Opcional para compatibilidad con el backend
}

export interface AntecedenteMedico {
  id: number;
  contraindicacionVacunacion: boolean;
  detalleContraindicacion: string;
  reaccionBiologicos: boolean;
  detalleReaccion: string;
  paciente: string;
  pacienteId?: number; // Opcional para compatibilidad con el backend
}