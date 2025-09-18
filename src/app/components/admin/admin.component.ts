import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Usuario } from '../../models/usuario';
import { DatePipe } from '@angular/common'; // Importar DatePipe
import { Router } from '@angular/router'; // Importar Router
import { InventarioVacunaService } from '../../services/inventario-vacuna.service';
import { EstadisticaService } from '../../services/estadistica.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [DatePipe] // Agregar DatePipe como proveedor
})
export class AdminComponent implements OnInit {

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

    // Obtener la fecha de última conexión desde localStorage
    this.lastLogin = this.loginService.getLastLoginFromLocalStorage();

    if (this.lastLogin) {
      // Formatear la fecha de última conexión
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
    this.router.navigate(['/admin', userId, ruta]);
  }
}