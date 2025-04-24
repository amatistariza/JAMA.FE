import { Component, OnInit } from '@angular/core';
import { AlertaService } from '../../../services/alerta.service';
import { Alerta } from '../../../models/alerta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alerta-enfermera',
  templateUrl: './alerta-enfermera.component.html',
  styleUrls: ['./alerta-enfermera.component.css']
})
export class AlertaEnfermeraComponent implements OnInit {
  alertas: Alerta[] = [];
  alertasFiltradas: Alerta[] = [];
  filtroTipo: string = '';
  filtroEstado: string = '';
  filtroPrioridad: string = '';

  constructor(private alertaService: AlertaService) {}

  ngOnInit(): void {
    this.cargarAlertas();
  }

  cargarAlertas(): void {
    this.alertaService.getAlertas().subscribe({
      next: (alertas) => {
        this.alertas = alertas;
        this.aplicarFiltros();
      },
      error: (error) => {
        console.error('Error al cargar alertas:', error);
        Swal.fire('Error', 'No se pudieron cargar las alertas', 'error');
      }
    });
  }

  aplicarFiltros(): void {
    this.alertasFiltradas = this.alertas.filter(alerta => {
      const cumpleTipo = !this.filtroTipo || alerta.tipo === this.filtroTipo;
      const cumpleEstado = !this.filtroEstado || alerta.estado === this.filtroEstado;
      const cumplePrioridad = !this.filtroPrioridad || alerta.prioridad === this.filtroPrioridad;
      return cumpleTipo && cumpleEstado && cumplePrioridad;
    });
  }

  marcarComoAtendida(id: number): void {
    this.alertaService.marcarComoAtendida(id).subscribe({
      next: () => {
        this.cargarAlertas();
        Swal.fire('Éxito', 'Alerta marcada como atendida', 'success');
      },
      error: (error) => {
        console.error('Error al actualizar alerta:', error);
        Swal.fire('Error', 'No se pudo actualizar la alerta', 'error');
      }
    });
  }

  getBadgeClass(tipo: string): string {
    const classes = {
      'VACUNACION': 'bg-primary',
      'ESQUEMA': 'bg-info',
      'SEGUIMIENTO': 'bg-warning',
      'INVENTARIO': 'bg-danger'
    };
    return classes[tipo as keyof typeof classes] || 'bg-secondary';
  }

  getEstadoBadgeClass(estado: string): string {
    const classes = {
      'PENDIENTE': 'bg-warning',
      'ATENDIDA': 'bg-success',
      'VENCIDA': 'bg-danger'
    };
    return classes[estado as keyof typeof classes] || 'bg-secondary';
  }

  getPrioridadBadgeClass(prioridad: string): string {
    const classes = {
      'ALTA': 'bg-danger',
      'MEDIA': 'bg-warning',
      'BAJA': 'bg-info'
    };
    return classes[prioridad as keyof typeof classes] || 'bg-secondary';
  }
}
