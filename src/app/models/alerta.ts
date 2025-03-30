export interface Alerta {
  id: number;
  tipo: 'VACUNACION' | 'ESQUEMA' | 'SEGUIMIENTO' | 'INVENTARIO';
  descripcion: string;
  fechaCreacion: string;
  fechaVencimiento: string;
  estado: 'PENDIENTE' | 'ATENDIDA' | 'VENCIDA';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA';
  pacienteId?: number;
  nombrePaciente?: string;
}
