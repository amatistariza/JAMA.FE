export class Vacuna  {
  id!: number;
  nombre!: string;
  laboratorio!: string;
  lote!: string;
  dosisDisponibles!: number;
  numeroDosis?: number;
  intervaloSemanas?: number;
  fechaRegistro!: Date;
}