
import { Component } from '@angular/core';
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


  // Filas individuales: cada registro completo del endpoint
  filasDetalladas: any[] = [];
  // Totales por vacuna: { vacuna, cantidad }
  totalesPorVacuna: Array<{vacuna: string, cantidad: number}> = [];
  // Totales por vacuna y régimen
  totalesPorVacunaYRegimen: Array<{vacuna: string, regimenAfiliacion: string, cantidad: number}> = [];
  // Totales por vacuna y etnia
  totalesPorVacunaYEtnia: Array<{vacuna: string, pertenenciaEtnica: string, cantidad: number}> = [];
  // Totales por vacuna y condición social
  totalesPorVacunaYCondicion: Array<{vacuna: string, desplazado: number, discapacitado: number, victimaConflicto: number, estudia: number}> = [];
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
    this.filasDetalladas = [];
    this.totalesPorVacuna = [];
    this.totalesPorVacunaYRegimen = [];
    this.totalesPorVacunaYEtnia = [];
    this.totalesPorVacunaYCondicion = [];
    this.totalGeneral = 0;

    // Filtrar por mes si corresponde
    const source = this.mesSeleccionado ? this.vacunasAplicadasRaw.filter(r => {
      if (!r || !r.fechaAplicacion) return false;
      const d = new Date(r.fechaAplicacion);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      return `${year}-${month}` === this.mesSeleccionado;
    }) : this.vacunasAplicadasRaw;

    // Guardar todos los registros para la tabla detallada y ordenar de A a Z por vacuna
    this.filasDetalladas = source.map(r => ({ ...r }));
    this.filasDetalladas.sort((a, b) => {
      const vacunaA = (a.vacuna || '').toString().toUpperCase();
      const vacunaB = (b.vacuna || '').toString().toUpperCase();
      return vacunaA.localeCompare(vacunaB);
    });

    // Totales por vacuna
    const mapTotales: { [vacuna: string]: number } = {};
    // Totales por vacuna y régimen
    const mapVacunaRegimen: { [key: string]: number } = {};
    // Totales por vacuna y etnia
    const mapVacunaEtnia: { [key: string]: number } = {};
    // Totales por vacuna y condición social
    const mapVacunaCondicion: { [vacuna: string]: {desplazado: number, discapacitado: number, victimaConflicto: number, estudia: number} } = {};

    for (const r of this.filasDetalladas) {
      const vacuna = (r.vacuna || '').toString();
      const regimen = (r.regimenAfiliacion || 'Sin régimen').toString();
      const etnia = (r.pertenenciaEtnica || 'NINGUNO').toString();

      // Total por vacuna
      mapTotales[vacuna] = (mapTotales[vacuna] || 0) + 1;

      // Total por vacuna y régimen
      const keyVacunaRegimen = `${vacuna}|${regimen}`;
      mapVacunaRegimen[keyVacunaRegimen] = (mapVacunaRegimen[keyVacunaRegimen] || 0) + 1;

      // Total por vacuna y etnia
      const keyVacunaEtnia = `${vacuna}|${etnia}`;
      mapVacunaEtnia[keyVacunaEtnia] = (mapVacunaEtnia[keyVacunaEtnia] || 0) + 1;

      // Total por vacuna y condición social
      if (!mapVacunaCondicion[vacuna]) {
        mapVacunaCondicion[vacuna] = {desplazado: 0, discapacitado: 0, victimaConflicto: 0, estudia: 0};
      }
      if (r.desplazado === true || r.desplazado === 'true' || r.desplazado === 'Sí' || r.desplazado === 'Si') {
        mapVacunaCondicion[vacuna].desplazado++;
      }
      if (r.discapacitado === true || r.discapacitado === 'true' || r.discapacitado === 'Sí' || r.discapacitado === 'Si') {
        mapVacunaCondicion[vacuna].discapacitado++;
      }
      if (r.victimaConflicto === true || r.victimaConflicto === 'true' || r.victimaConflicto === 'Sí' || r.victimaConflicto === 'Si') {
        mapVacunaCondicion[vacuna].victimaConflicto++;
      }
      if (r.estudiaActualmente === true || r.estudiaActualmente === 'true' || r.estudiaActualmente === 'Sí' || r.estudiaActualmente === 'Si') {
        mapVacunaCondicion[vacuna].estudia++;
      }

      this.totalGeneral += 1;
    }

    // Construir arrays de totales
    this.totalesPorVacuna = Object.keys(mapTotales).map(v => ({ vacuna: v, cantidad: mapTotales[v] }));
    this.totalesPorVacuna.sort((a, b) => a.vacuna.localeCompare(b.vacuna));

    this.totalesPorVacunaYRegimen = Object.keys(mapVacunaRegimen).map(k => {
      const [vacuna, regimen] = k.split('|');
      return { vacuna, regimenAfiliacion: regimen, cantidad: mapVacunaRegimen[k] };
    });
    this.totalesPorVacunaYRegimen.sort((a, b) => {
      const cmpVacuna = a.vacuna.localeCompare(b.vacuna);
      if (cmpVacuna !== 0) return cmpVacuna;
      return a.regimenAfiliacion.localeCompare(b.regimenAfiliacion);
    });

    this.totalesPorVacunaYEtnia = Object.keys(mapVacunaEtnia).map(k => {
      const [vacuna, etnia] = k.split('|');
      return { vacuna, pertenenciaEtnica: etnia, cantidad: mapVacunaEtnia[k] };
    });
    this.totalesPorVacunaYEtnia.sort((a, b) => {
      const cmpVacuna = a.vacuna.localeCompare(b.vacuna);
      if (cmpVacuna !== 0) return cmpVacuna;
      return a.pertenenciaEtnica.localeCompare(b.pertenenciaEtnica);
    });

    this.totalesPorVacunaYCondicion = Object.keys(mapVacunaCondicion).map(vacuna => {
      return {
        vacuna,
        desplazado: mapVacunaCondicion[vacuna].desplazado,
        discapacitado: mapVacunaCondicion[vacuna].discapacitado,
        victimaConflicto: mapVacunaCondicion[vacuna].victimaConflicto,
        estudia: mapVacunaCondicion[vacuna].estudia
      };
    });
    this.totalesPorVacunaYCondicion.sort((a, b) => a.vacuna.localeCompare(b.vacuna));
  }
  // Utilidad para mostrar Sí/No en vez de true/false
  mostrarSiNo(valor: any): string {
    if (valor === true || valor === 'true') return 'Sí';
    if (valor === false || valor === 'false') return 'No';
    if (typeof valor === 'string' && valor.toLowerCase() === 'sí') return 'Sí';
    if (typeof valor === 'string' && valor.toLowerCase() === 'si') return 'Sí';
    if (typeof valor === 'string' && valor.toLowerCase() === 'no') return 'No';
    return 'No';
  }

  // Utilidad para mostrar pertenencia etnica
  mostrarEtnia(valor: any): string {
    if (!valor || valor === 'string' || valor.toString().trim() === '') return 'NINGUNO';
    return valor.toString();
  }

  filtrarPacientes() { }
  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  imprimir() {
    // Remover paginación para mostrar todos los datos en la impresión
    const originalItemsPorPagina = this.itemsPorPagina;
    this.itemsPorPagina = this.filasDetalladas.length || 1000;
    
    setTimeout(() => {
      window.print();
      // Restaurar paginación después de imprimir
      setTimeout(() => {
        this.itemsPorPagina = originalItemsPorPagina;
      }, 500);
    }, 100);
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

  // Calcular total de la tabla vacuna y régimen
  getTotalVacunaRegimen(): number {
    return this.totalesPorVacunaYRegimen.reduce((sum, t) => sum + t.cantidad, 0);
  }

  // Calcular total de la tabla vacuna y etnia
  getTotalVacunaEtnia(): number {
    return this.totalesPorVacunaYEtnia.reduce((sum, t) => sum + t.cantidad, 0);
  }

  // Calcular totales por columna de condición social
  getTotalDesplazados(): number {
    return this.totalesPorVacunaYCondicion.reduce((sum, t) => sum + t.desplazado, 0);
  }

  getTotalDiscapacitados(): number {
    return this.totalesPorVacunaYCondicion.reduce((sum, t) => sum + t.discapacitado, 0);
  }

  getTotalVictimas(): number {
    return this.totalesPorVacunaYCondicion.reduce((sum, t) => sum + t.victimaConflicto, 0);
  }

  getTotalEstudia(): number {
    return this.totalesPorVacunaYCondicion.reduce((sum, t) => sum + t.estudia, 0);
  }
}
