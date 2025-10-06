
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
  // Totales por sexo y régimen
  totalesPorSexoYRegimen: Array<{sexo: string, regimenAfiliacion: string, cantidad: number}> = [];
  // Totales por sexo y etnia
  totalesPorSexoYEtnia: Array<{sexo: string, pertenenciaEtnica: string, cantidad: number}> = [];
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
    this.totalesPorSexoYRegimen = [];
    this.totalesPorSexoYEtnia = [];
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
    // Totales por sexo y régimen
    const mapSexoRegimen: { [key: string]: number } = {};
    // Totales por sexo y etnia
    const mapSexoEtnia: { [key: string]: number } = {};

    for (const r of this.filasDetalladas) {
      const vacuna = (r.vacuna || '').toString();
      const sexo = (r.sexo || 'Sin especificar').toString();
      const regimen = (r.regimenAfiliacion || 'Sin régimen').toString();
      const etnia = (r.pertenenciaEtnica || 'NINGUNO').toString();

      // Total por vacuna
      mapTotales[vacuna] = (mapTotales[vacuna] || 0) + 1;

      // Total por sexo y régimen
      const keySexoRegimen = `${sexo}|${regimen}`;
      mapSexoRegimen[keySexoRegimen] = (mapSexoRegimen[keySexoRegimen] || 0) + 1;

      // Total por sexo y etnia
      const keySexoEtnia = `${sexo}|${etnia}`;
      mapSexoEtnia[keySexoEtnia] = (mapSexoEtnia[keySexoEtnia] || 0) + 1;

      this.totalGeneral += 1;
    }

    // Construir arrays de totales
    this.totalesPorVacuna = Object.keys(mapTotales).map(v => ({ vacuna: v, cantidad: mapTotales[v] }));
    this.totalesPorVacuna.sort((a, b) => a.vacuna.localeCompare(b.vacuna));

    this.totalesPorSexoYRegimen = Object.keys(mapSexoRegimen).map(k => {
      const [sexo, regimen] = k.split('|');
      return { sexo, regimenAfiliacion: regimen, cantidad: mapSexoRegimen[k] };
    });
    this.totalesPorSexoYRegimen.sort((a, b) => {
      const cmpSexo = a.sexo.localeCompare(b.sexo);
      if (cmpSexo !== 0) return cmpSexo;
      return a.regimenAfiliacion.localeCompare(b.regimenAfiliacion);
    });

    this.totalesPorSexoYEtnia = Object.keys(mapSexoEtnia).map(k => {
      const [sexo, etnia] = k.split('|');
      return { sexo, pertenenciaEtnica: etnia, cantidad: mapSexoEtnia[k] };
    });
    this.totalesPorSexoYEtnia.sort((a, b) => {
      const cmpSexo = a.sexo.localeCompare(b.sexo);
      if (cmpSexo !== 0) return cmpSexo;
      return a.pertenenciaEtnica.localeCompare(b.pertenenciaEtnica);
    });
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

  // Calcular total de la tabla sexo y régimen
  getTotalSexoRegimen(): number {
    return this.totalesPorSexoYRegimen.reduce((sum, t) => sum + t.cantidad, 0);
  }

  // Calcular total de la tabla sexo y etnia
  getTotalSexoEtnia(): number {
    return this.totalesPorSexoYEtnia.reduce((sum, t) => sum + t.cantidad, 0);
  }
}
