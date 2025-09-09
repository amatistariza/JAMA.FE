import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsquemaVacunacionService } from '../../../services/esquema-vacunacion.service';
import { PacienteService } from '../../../services/paciente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-esquema-detalles',
  templateUrl: './esquema-detalles.component.html',
  styleUrls: ['./esquema-detalles.component.css']
})
export class EsquemaDetallesComponent implements OnInit {
  isEnfermera: boolean = false;
  esquema: any = null;
  currentDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private esquemaService: EsquemaVacunacionService,
    private pacienteService: PacienteService
  ) {
    this.isEnfermera = this.router.url.includes('/enfermera/');
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['esquemaId']) {
        this.loadEsquema(parseInt(params['esquemaId']));
      }
    });
  }

  loadEsquema(id: number) {
    console.log('Cargando esquema:', id);
    this.esquemaService.getEsquemaById(id).subscribe({
      next: (data) => {
        console.log('Data recibida:', data);
        if (data) {
          this.esquema = {
            ...data,
            detalles: data.detalles?.map(detalle => ({
              ...detalle,
              cantidadUtilizadaVacuna: detalle.cantidadUtilizadaVacuna,
            }))
          };

          // Si hay pacienteId, cargar los datos del paciente
          if (data.pacienteId) {
            this.pacienteService.getPacienteById(data.pacienteId).subscribe({
              next: (paciente) => {
                this.esquema = {
                  ...this.esquema,
                  paciente: paciente
                };
                console.log('Esquema completo:', this.esquema);
              },
              error: (error) => {
                console.error('Error al cargar paciente:', error);
              }
            });
          }
        }
      },
      error: (error) => {
        Swal.fire('Error', 'No se pudo cargar el esquema', 'error');
        this.navegarAtras();
      }
    });
  }

  navegarAtras() {
    const userId = this.route.snapshot.parent?.params['id'];
    const baseRoute = this.isEnfermera ? 'enfermera' : 'admin';
    this.router.navigate([`/${baseRoute}/${userId}/registro-vacuna`]);
  }

  imprimir() {
    window.print();
  }


}
