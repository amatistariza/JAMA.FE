export interface CondicionUsuaria {
    id: number;
    condicion: string;
    gestante: boolean;
    fechaUltimaMenstruacion?: string;
    semanasGestacion: number;
    fechaProbableParto?: string;
    cantidadEmbarazosPrevios: number;
  }