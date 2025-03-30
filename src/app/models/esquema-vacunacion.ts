export interface EsquemaVacunacion {
  id: number;
  tipoCarnet: string;
  responsable: string;
  registradoPAI: boolean;
  motivoNoIngreso: string;
  observaciones: string;
  pacienteId: number;
  detalles: DetalleEsquema[];
}

export interface DetalleEsquema {
  id: number;
  esquemaVacunacionId: number;
  esquemaVacunacion: string;
  vacunaId: number;
  vacuna: Vacuna;
  cantidadUtilizadaVacuna: number;
  sueroId: number;
  suero: Suero;
  cantidadUtilizadaSuero: number;
  diluyenteId: number;
  diluyente: Diluyente;
  cantidadUtilizadaDiluyente: number;
  jeringaId: number;
  jeringa: Jeringa;
  cantidadUtilizadaJeringa: number;
}

interface Vacuna {
  id: number;
  nombre: string;
  laboratorio: string;
  lote: string;
  dosisDisponibles: number;
  fechaRegistro: string;
}

interface Suero {
  id: number;
  nombre: string;
  lote: string;
  frascosDisponibles: number;
}

interface Diluyente {
  id: number;
  nombre: string;
  lote: string;
  cantidadDisponible: number;
}

interface Jeringa {
  id: number;
  tipo: string;
  lote: string;
  cantidadDisponible: number;
}
