import { Component } from '@angular/core';
import { DosisEstadistica } from '../../../models/estadisticas';
import { EsquemaVacunacionService } from '../../../services/esquema-vacunacion.service';
import { FormBuilder } from '@angular/forms';
import { EstadisticaService } from '../../../services/estadistica.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reportes-detallados',
  templateUrl: './reportes-detallados.component.html',
  styleUrl: './reportes-detallados.component.css'
})
export class ReportesDetalladosComponent {
  // Datos crudos del endpoint vacunas-aplicadas
  vacunasAplicadasRaw: any[] = [];
  mesesDisponibles: { value: string, label: string }[] = [];
  mesSeleccionado: string = '';

  // Filas individuales: { vacuna, numeroDosis, edad, cantidad }
  filasPorEdad: Array<{vacuna: string, numeroDosis: number, edad: number, cantidad: number}> = [];

  // Totales por vacuna: { vacuna, cantidad }
  totalesPorVacuna: Array<{vacuna: string, cantidad: number}> = [];

  totalGeneral: number = 0;

  itemsPorPagina: number = 10;
  paginaActual: number = 1;
  filtro: string = '';
  constructor(
    private fb: FormBuilder,
    private estadisticaService: EstadisticaService
  ) {
    // You can initialize things here if needed
  }

  ngOnInit() {
    this.loadVacunasAplicadas();
  }
  addItem() {

  }
  // antiguas funciones removidas: ahora usamos getVacunasAplicadas()

  private loadVacunasAplicadas(): void {
    this.estadisticaService.getVacunasAplicadas().subscribe(
      (data: any[]) => {
        this.vacunasAplicadasRaw = data || [];
        this.buildAvailableMonthsFromData();
        this.processVacunasAplicadas();
      },
      (error) => {
        console.error('Error al cargar vacunas aplicadas:', error);
        Swal.fire('Error', 'No se pudieron cargar las vacunas aplicadas', 'error');
      }
    );
  }

  private buildAvailableMonthsFromData(): void {
    const monthsSet = new Set<string>();
    for (const r of this.vacunasAplicadasRaw) {
      if (r && r.fechaAplicacion) {
        const d = new Date(r.fechaAplicacion);
        if (!isNaN(d.getTime())) {
          const year = d.getFullYear();
          const month = (d.getMonth() + 1).toString().padStart(2, '0');
          monthsSet.add(`${year}-${month}`);
        }
      }
    }
    const monthsArray = Array.from(monthsSet).sort().reverse(); // orden descendente
    this.mesesDisponibles = monthsArray.map(m => {
      const [y, mm] = m.split('-');
      const monthNum = parseInt(mm, 10);
      const label = `${y} - ${this.getMonthName(monthNum)}`;
      return { value: m, label };
    });
  }

  private processVacunasAplicadas() {
    // limpiar
    this.filasPorEdad = [];
    this.totalesPorVacuna = [];
    this.totalGeneral = 0;

    // Crear filas individuales: cada registro cuenta como 1
    const source = this.mesSeleccionado ? this.vacunasAplicadasRaw.filter(r => {
      if (!r || !r.fechaAplicacion) return false;
      const d = new Date(r.fechaAplicacion);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      return `${year}-${month}` === this.mesSeleccionado;
    }) : this.vacunasAplicadasRaw;

    for (const r of source) {
      const vacuna = (r.vacuna || '').toString();
      const numeroDosis = Number(r.numeroDosis || 0);
      const edad = Number(r.edad || 0);
      this.filasPorEdad.push({ vacuna, numeroDosis, edad, cantidad: 1 });
    }

    // Ordenar filas por vacuna (alfabético)
    this.filasPorEdad.sort((a, b) => a.vacuna.localeCompare(b.vacuna));

    // Totales por vacuna
    const mapTotales: { [vacuna: string]: number } = {};
    for (const f of this.filasPorEdad) {
      mapTotales[f.vacuna] = (mapTotales[f.vacuna] || 0) + f.cantidad;
      this.totalGeneral += f.cantidad;
    }

    this.totalesPorVacuna = Object.keys(mapTotales).map(v => ({ vacuna: v, cantidad: mapTotales[v] }));
    // Ordenar totales también por vacuna
    this.totalesPorVacuna.sort((a, b) => a.vacuna.localeCompare(b.vacuna));
  }

  filtrarPacientes() { }
  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  imprimir() {
    window.print();
  }

  onMesChange(value: string) {
    this.mesSeleccionado = value;
    this.processVacunasAplicadas();
  }

  private getMonthName(monthNumber: number): string {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const idx = Math.max(0, Math.min(11, monthNumber - 1));
    return months[idx] || '';
  }

  // total general calculado a partir de filasPorEdad
  get totalDosis(): number {
    return this.totalGeneral;
  }
}
