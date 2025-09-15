import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlarmasService, AlarmasResponse, AlarmaItem } from '../../../services/alarmas.service';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-alarmas',
  templateUrl: './alarmas.component.html',
  styleUrls: ['./alarmas.component.css']
})
export class AlarmasComponent implements OnInit, OnDestroy {
  alarmas: AlarmaItem[] = [];
  total = 0;
  loading = false;
  error = '';

  private sub: Subscription | null = null;

  constructor(
    private alarmasService: AlarmasService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {

      this.sub = timer(0, 3600000).pipe(
        switchMap(() => {
          // Poll silencioso: no activar indicador global de carga para evitar parpadeos en la UI
          this.error = '';
          return this.alarmasService.getProximasMesActual();
        })
    ).subscribe({
      next: (res: AlarmasResponse) => {
        this.loading = false;
        this.alarmas = res.data || [];
        this.total = res.total || this.alarmas.length;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'No se pudieron cargar las alarmas';
        console.error('Alarmas error', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  refresh(): void {
    this.loading = true;
    this.alarmasService.getProximasMesActual().subscribe({
      next: (res) => {
        this.loading = false;
        this.alarmas = res.data || [];
        this.total = res.total || this.alarmas.length;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'No se pudieron cargar las alarmas';
        console.error(err);
      }
    });
  }

  goToGestionAlarmas(): void {
    const userId = this.loginService.getUserIdFromToken();
    const role = this.loginService.getUserRole();
    if (role === 'ENFERMERA') {
      this.router.navigate([`/enfermera/${userId}/gestionAlarmas`]);
    } else if (role === 'ADMINISTRADOR') {
      // Para admin navegamos a la gestión de alarmas también si existe la ruta
      this.router.navigate([`/admin/${userId}/gestionAlarmas`]);
    } else {
      // Por defecto, intento navegar a la ruta principal
      this.router.navigate(['/']);
    }
  }
}

