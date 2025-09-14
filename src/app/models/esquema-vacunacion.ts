export interface EsquemaVacunacion {
  numeroIdentificacion: any;
  tipoCarnet: string;
  responsable: string;
  registradoPAI: boolean;
  motivoNoIngreso: string;
  observaciones: string;
  pacienteId: number;
  detalles: DetalleEsquema[];
}

export interface DetalleEsquema {
  id?: number;
  esquemaVacunacionId?: number;
  vacunaId: number;
  vacuna?: Vacuna;
  cantidadUtilizadaVacuna: number;
  sueroId?: number;
  suero?: Suero;
  cantidadUtilizadaSuero: number;
  diluyenteId?: number;
  diluyente?: Diluyente;
  cantidadUtilizadaDiluyente: number;
  jeringaId: number;
  jeringa?: Jeringa;
  cantidadUtilizadaJeringa: number;
  dosis: number;
  via: string;
  sitioAplicacion: string;
  lote: string;
}

export interface Vacuna {
  id: number;
  nombre: string;
  laboratorio: string;
  lote: string;
  dosisDisponibles: number;
  fechaRegistro: string;
}

export interface Suero {
  id: number;
  nombre: string;
  lote: string;
  frascosDisponibles: number;
}

export interface Diluyente {
  id: number;
  nombre: string;
  lote: string;
  cantidadDisponible: number;
}

export interface Jeringa {
  id: number;
  tipo: string;
  lote: string;
  cantidadDisponible: number;
}
