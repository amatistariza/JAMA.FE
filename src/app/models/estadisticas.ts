export interface BajoStock {
  umbral: number;
  vacunasBajoUmbral: number;
  jeringasBajoUmbral: number;
}

export interface DashboardResumen {
  ultimaActualizacion: string; 
  totalDosisVacunas: number;
  totalJeringas: number;
  totalDiluyentes: number;
  aplicacionesHoy: number;
  aplicacionesSemana: number;
  bajoStock: BajoStock;
}

export interface DosisEstadistica {
  vacuna: string;
  dosis: number;
}