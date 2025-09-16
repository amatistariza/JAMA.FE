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
        this.loadEstadisticasDosis();
    }
    addItem() {

    }
    loadEstadisticasDosis(): void {
        this.estadisticaService.getEstadisticasDosis().subscribe(
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

    filtrarPacientes() { }
    cambiarPagina(pagina: number): void {
        this.paginaActual = pagina;
    }

    imprimir() {
        window.print();
    }

    get totalDosis(): number {
        if (!this.estadisticasDosisFiltradas || this.estadisticasDosisFiltradas.length === 0) {
            return 0;
        }
        return this.estadisticasDosisFiltradas.reduce((sum, item) => sum + (item?.dosis || 0), 0);
    }
}
