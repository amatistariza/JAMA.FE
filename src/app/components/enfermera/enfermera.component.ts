import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { InventarioVacunaService } from '../../services/inventario-vacuna.service';
import { EstadisticaService } from '../../services/estadistica.service';

@Component({
  selector: 'app-enfermera',
  templateUrl: './enfermera.component.html',
  styleUrls: ['./enfermera.component.css'],
  providers: [DatePipe]
})
export class EnfermeraComponent implements OnInit {
  user: Usuario | null = null;
  lastLogin: string | null = null;
  formattedLastLogin: string | null = null;
  totalVacunas: number = 0;
  totalJeringas: number = 0;
  totalDiluyentes: number = 0;
  vacunasAplicadasMes: number = 0;


  constructor(
    private estadisticaService: EstadisticaService,
    private loginService: LoginService,
    private datePipe: DatePipe,
    private router: Router,
    private vacunaService: InventarioVacunaService
  ) { }

  ngOnInit(): void {
    // Obtener el usuario desde el token
    this.user = this.loginService.getUserFromToken();
    this.lastLogin = this.loginService.getLastLoginFromLocalStorage();

    if (this.lastLogin) {
      this.formattedLastLogin = this.datePipe.transform(this.lastLogin, 'dd/MM/yyyy');
    }

    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.estadisticaService.getEstadisticas().subscribe(data => {
      this.totalVacunas = data.totalDosisVacunas;
      this.totalJeringas = data.totalJeringas;
      this.totalDiluyentes = data.totalDiluyentes;
      this.vacunasAplicadasMes = data.aplicacionesMes;
    });
  }

  navegarA(ruta: string) {
    const userId = this.loginService.getUserIdFromToken();
    this.router.navigate(['/enfermera', userId, ruta]);
  }

}
