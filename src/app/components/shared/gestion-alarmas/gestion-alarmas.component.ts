import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { AlarmaItem, AlarmasService } from '../../../services/alarmas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-alarmas',
  templateUrl: './gestion-alarmas.component.html',
  styleUrl: './gestion-alarmas.component.css'
})
export class GestionAlarmasComponent implements OnInit {

  isEnfermera: boolean = false;
  userId: string | null = null;
  alarmas: AlarmaItem[] = [];
  total = 0;
  loading = false;
  error = '';
  filtro: string = '';
  alarmasFiltradas: AlarmaItem[] = [];
  itemsPorPagina: number = 5;
  paginaActual: number = 1;

  constructor(private alarmasService: AlarmasService,
    private router: Router,
    private loginService: LoginService) { }

  ngOnInit(): void {
    const role = this.loginService.getUserRole();
    this.isEnfermera = role === 'ENFERMERA';
    this.userId = this.loginService.getUserIdFromToken();
    this.actualizar();
  }

  actualizar(): void {
    this.loading = true;
    this.alarmasService.getProximasMesActual().subscribe({
      next: (res) => {
        this.loading = false;
        this.alarmas = res.data || [];
        this.alarmasFiltradas = [...this.alarmas];
        this.total = res.total || this.alarmas.length;
        
      },
      error: (err) => {
        this.loading = false;
        this.error = 'No se pudieron cargar las alarmas';
        console.error(err);
      }
    });
    
  }

  filtrar(): void {
    const q = this.filtro.trim();
    if (!q) {
      this.alarmasFiltradas = [...this.alarmas];
      this.paginaActual = 1;
      return;
    }
    this.alarmasFiltradas = this.alarmas.filter(a =>
      (a.numeroIdentificacion || '').includes(q) || (a.nombre || '').toLowerCase().includes(q.toLowerCase())
    );
    this.paginaActual = 1;
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
  }

  gestionar(alarma: AlarmaItem): void {
    const baseRoute = this.isEnfermera ? 'enfermera' : 'admin';
    const userId = this.userId || this.loginService.getUserIdFromToken();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    // Intentar extraer el nombre de la vacuna desde el campo 'pendiente'
    let vacunaName: string | undefined = undefined;
    if (alarma.pendiente) {
      // Ejemplo: 'Dosis 2 de Neumococo' -> extraer 'Neumococo'
      const match = alarma.pendiente.match(/de\s+(.+)$/i);
      if (match && match[1]) {
        vacunaName = match[1].trim();
      }
    }

    this.router.navigate([`/${baseRoute}/${userId}/registro-vacuna`], { queryParams: { identificacion: alarma.numeroIdentificacion, vacunaName } });
  }

  eliminarAlarma(alarmaId?: number): void {
    if (!alarmaId) {
      Swal.fire('Error', 'ID de la alarma no disponible', 'error');
      return;
    }

    Swal.fire({
      title: '¿Marcar como notificada?',
      text: 'Se marcará la alarma como notificada. Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, marcar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.loading = true;
        this.alarmasService.marcarNotificada(alarmaId).subscribe({
          next: (res) => {
            this.loading = false;
            Swal.fire('Hecho', res.mensaje || 'Alarma marcada como notificada', 'success');
            // refrescar lista
            this.actualizar();
            window.location.reload();
          },
          error: (err) => {
            this.loading = false;
            console.error(err);
            Swal.fire('Error', 'No se pudo marcar la alarma como notificada', 'error');
          }
        });
      }
    });
  }


}
