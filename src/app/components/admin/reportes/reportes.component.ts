import { Component } from '@angular/core';
import { DosisEstadistica } from '../../../models/estadisticas';
import { EsquemaVacunacionService } from '../../../services/esquema-vacunacion.service';
import { FormBuilder } from '@angular/forms';
import { EstadisticaService } from '../../../services/estadistica.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-reportes',
    templateUrl: './reportes.component.html',
    styleUrl: './reportes.component.css'
})
export class ReportesComponent {
    estadisticasDosis: DosisEstadistica[] = [];
    estadisticasDosisFiltradas: DosisEstadistica[] = [];
    mesesDisponibles: { value: string, label: string }[] = [];
    mesSeleccionado: string = '';
    itemsPorPagina: number = 5;
    paginaActual: number = 1;
    filtro: string = '';
    constructor(
        private fb: FormBuilder,
        private estadisticaService: EstadisticaService
    ) {
        // You can initialize things here if needed
    }

    ngOnInit() {
        this.loadAvailableMonths();
        this.loadEstadisticasDosis();
    }
    addItem() {

    }
    loadEstadisticasDosis(month?: string): void {
        // Si hay mes seleccionado, usar endpoint que acepta month
        const obs = month ? this.estadisticaService.getEstadisticasDosisForMonth(month) : this.estadisticaService.getEstadisticasDosis();
        obs.subscribe(
            (data) => {
                this.estadisticasDosis = data;
                this.estadisticasDosisFiltradas = [...this.estadisticasDosis];
            },
            (error) => {
                console.error('Error al cargar los esquemas:', error);
                Swal.fire('Error', 'No se pudieron cargar los esquemas', 'error');
            }
        );
    }

    loadAvailableMonths(): void {
        this.estadisticaService.getAvailableMonths().subscribe(
            (data) => {
                // data puede ser un array de strings 'YYYY-MM' o de objetos { year, month }
                this.mesesDisponibles = (data || []).map((m: any) => {
                    if (typeof m === 'string') {
                        const [year, month] = m.split('-');
                        const label = `${year} - ${this.getMonthName(parseInt(month, 10))}`;
                        return { value: m, label };
                    }
                    if (m && m.year != null && m.month != null) {
                        const monthNum = m.month.toString().padStart(2, '0');
                        const value = `${m.year}-${monthNum}`;
                        const label = `${m.year} - ${this.getMonthName(m.month)}`;
                        return { value, label };
                    }
                    return null;
                }).filter((x: any) => x != null);
            },
            (error) => {
                console.error('Error al cargar meses disponibles:', error);
            }
        );
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
        this.loadEstadisticasDosis(value || undefined);
    }

    private getMonthName(monthNumber: number): string {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const idx = Math.max(0, Math.min(11, monthNumber - 1));
        return months[idx] || '';
    }

    get totalDosis(): number {
        if (!this.estadisticasDosisFiltradas || this.estadisticasDosisFiltradas.length === 0) {
            return 0;
        }
        return this.estadisticasDosisFiltradas.reduce((sum, item) => sum + (item?.dosis || 0), 0);
    }
}
