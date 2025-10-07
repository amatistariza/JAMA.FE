import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EstadisticaService } from '../../../services/estadistica.service';
import Swal from 'sweetalert2';

interface DatoUnificado {
  categoria: string;
  valores: number[];
  total: number;
  esTotal?: boolean;
  esSeccion?: boolean;
  colorFondo?: string;
}

@Component({
  selector: 'app-reporte-datos',
  templateUrl: './reporte-datos.component.html',
  styleUrl: './reporte-datos.component.css'
})
export class ReporteDatosComponent implements OnInit {
  // Datos crudos del endpoint vacunas-aplicadas
  vacunasAplicadasRaw: any[] = [];
  mesesDisponibles: { value: string, label: string }[] = [];
  mesSeleccionado: string = '';

  // Datos para la tabla unificada
  datosUnificados: DatoUnificado[] = [];
  columnasVacunas: string[] = [];

  constructor(
    private fb: FormBuilder,
    private estadisticaService: EstadisticaService
  ) {}

  ngOnInit(): void {
    this.loadVacunasAplicadas();
  }

  private loadVacunasAplicadas(): void {
    this.estadisticaService.getVacunasAplicadas().subscribe(
      (data: any[]) => {
        this.vacunasAplicadasRaw = data || [];
        this.buildAvailableMonthsFromData();
        this.procesarDatosUnificados();
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
    const monthsArray = Array.from(monthsSet).sort().reverse();
    this.mesesDisponibles = monthsArray.map(m => {
      const [y, mm] = m.split('-');
      const monthNum = parseInt(mm, 10);
      const label = `${y} - ${this.getMonthName(monthNum)}`;
      return { value: m, label };
    });
  }

  private procesarDatosUnificados(): void {
    this.datosUnificados = [];
    
    // Filtrar por mes si está seleccionado
    const source = this.mesSeleccionado ? this.vacunasAplicadasRaw.filter(r => {
      if (!r || !r.fechaAplicacion) return false;
      const d = new Date(r.fechaAplicacion);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      return `${year}-${month}` === this.mesSeleccionado;
    }) : this.vacunasAplicadasRaw;

    // Las columnas SIEMPRE son FEMENINO y MASCULINO
    this.columnasVacunas = ['FEMENINO', 'MASCULINO'];

    // ===== SECCIÓN 1: GÉNERO =====
    this.datosUnificados.push({
      categoria: 'GÉNERO',
      valores: [],
      total: 0,
      esSeccion: true
    });

    const generos = ['FEMENINO', 'MASCULINO'];
    generos.forEach(generoFila => {
      const valores = this.columnasVacunas.map(generoColumna => {
        return source.filter(v => 
          ((v.sexo || '').toString().toUpperCase() === generoFila) &&
          ((v.sexo || '').toString().toUpperCase() === generoColumna)
        ).length;
      });
      
      this.datosUnificados.push({
        categoria: generoFila,
        valores: valores,
        total: valores.reduce((a, b) => a + b, 0)
      });
    });

    const totalGenero = this.columnasVacunas.map((generoColumna) => 
      source.filter(v => ((v.sexo || '').toString().toUpperCase() === generoColumna)).length
    );
    this.datosUnificados.push({
      categoria: 'TOTAL GENERO',
      valores: totalGenero,
      total: totalGenero.reduce((a, b) => a + b, 0),
      esTotal: true
    });

    // ===== SECCIÓN 2: RÉGIMEN =====
    this.datosUnificados.push({
      categoria: 'RÉGIMEN',
      valores: [],
      total: 0,
      esSeccion: true
    });

    const regimenes = ['CONTRIBUTIVO', 'SUBSIDIADO', 'POBRE NO ASEGURADO', 'REGIMEN ESPECIAL', 'OTRO'];
    regimenes.forEach(regimen => {
      const valores = this.columnasVacunas.map(generoColumna => {
        return source.filter(v => 
          ((v.regimenAfiliacion || '').toString().toUpperCase() === regimen) &&
          ((v.sexo || '').toString().toUpperCase() === generoColumna)
        ).length;
      });
      
      const total = valores.reduce((a, b) => a + b, 0);
      if (total > 0) {
        this.datosUnificados.push({
          categoria: regimen,
          valores: valores,
          total: total
        });
      }
    });

    const totalRegimen = this.columnasVacunas.map((generoColumna) => 
      regimenes.reduce((sum, regimen) => {
        return sum + source.filter(v => 
          ((v.regimenAfiliacion || '').toString().toUpperCase() === regimen) &&
          ((v.sexo || '').toString().toUpperCase() === generoColumna)
        ).length;
      }, 0)
    );
    this.datosUnificados.push({
      categoria: 'TOTAL REGIMEN',
      valores: totalRegimen,
      total: totalRegimen.reduce((a, b) => a + b, 0),
      esTotal: true
    });

    // ===== SECCIÓN 3: ETNIAS =====
    this.datosUnificados.push({
      categoria: 'ETNIAS',
      valores: [],
      total: 0,
      esSeccion: true
    });

    const etnias = [
      { display: 'INDÍGENA', valores: ['INDIGENA'] },
      { display: 'ROM (GITANO)', valores: ['ROM(GITANO)'] },
      { display: 'RAIZAL', valores: ['RAIZAL'] },
      { display: 'PALENQUERO', valores: ['PALENQUERO'] },
      { display: 'NEGRO, MULATO, AFROCOLOMBIANO', valores: ['NEGRO,PALENQUERO,MULATO,AFROCOLOMBIANO'] },
      { display: 'NINGUNA PERTENENCIA ÉTNICA', valores: ['NINGUNO', ''] }
    ];

    etnias.forEach(etnia => {
      const valores = this.columnasVacunas.map(generoColumna => {
        return source.filter(v => {
          const etniaValor = (v.pertenenciaEtnica || '').toString().trim().toUpperCase();
          const matchEtnia = etnia.valores.some(val => etniaValor === val.toUpperCase() || (!etniaValor && val === ''));
          const matchGenero = ((v.sexo || '').toString().toUpperCase() === generoColumna);
          return matchEtnia && matchGenero;
        }).length;
      });
      
      const total = valores.reduce((a, b) => a + b, 0);
      if (total > 0) {
        this.datosUnificados.push({
          categoria: etnia.display,
          valores: valores,
          total: total
        });
      }
    });

    const totalEtnia = this.columnasVacunas.map((generoColumna) => 
      source.filter(v => ((v.sexo || '').toString().toUpperCase() === generoColumna)).length
    );
    this.datosUnificados.push({
      categoria: 'TOTAL ETNICOS',
      valores: totalEtnia,
      total: totalEtnia.reduce((a, b) => a + b, 0),
      esTotal: true
    });

    // ===== SECCIONES ADICIONALES =====
    const seccionesAdicionales = [
      { nombre: 'EN SITUACION DE DESPLAZADO', campo: 'desplazado' },
      { nombre: 'EN SITUACION DE DISCAPACIDAD', campo: 'discapacitado' },
      { nombre: 'VICTIMAS DEL CONFLICTO ARMADO', campo: 'victimaConflicto' },
      { nombre: 'ESTUDIA ACTUALMENTE', campo: 'estudiaActualmente' }
    ];

    seccionesAdicionales.forEach(seccion => {
      const valores = this.columnasVacunas.map(generoColumna => {
        return source.filter(v => 
          v[seccion.campo] === true &&
          ((v.sexo || '').toString().toUpperCase() === generoColumna)
        ).length;
      });
      
      this.datosUnificados.push({
        categoria: seccion.nombre,
        valores: valores,
        total: valores.reduce((a, b) => a + b, 0)
      });
    });
  }

  onMesChange(value: string): void {
    this.mesSeleccionado = value;
    this.procesarDatosUnificados();
  }

  private getMonthName(monthNumber: number): string {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const idx = Math.max(0, Math.min(11, monthNumber - 1));
    return months[idx] || '';
  }

  imprimir(): void {
    setTimeout(() => {
      window.print();
    }, 100);
  }
}
