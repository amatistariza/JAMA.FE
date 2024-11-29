import { Component, OnInit } from '@angular/core';
import { InventarioVacunaService } from '../../services/inventario-vacuna.service';
import { Vacuna } from '../../models/vacuna';

@Component({
  selector: 'app-gestion-inventario',
  templateUrl: './gestion-inventario.component.html',
  styleUrls: ['./gestion-inventario.component.css']
})
export class GestionInventarioComponent implements OnInit {
  vacunas: Vacuna[] = [];

  constructor(private vacunaService: InventarioVacunaService) {}

  ngOnInit(): void {
    this.loadVacunas(); // Cargar las vacunas al inicializar el componente
  }

  loadVacunas(): void {
    this.vacunaService.getVacunas().subscribe(
      (vacunas) => {
        // Mapear los campos para que coincidan con el modelo
        this.vacunas = vacunas.map(vacuna => ({
          ...vacuna,
          fechaRegistro: new Date(vacuna.fechaRegistro)  // Convertir fechaRegistro en fecharegistro
        }));
        console.log('Vacunas cargadas:', this.vacunas); // Verifica en la consola si las vacunas se cargan
      },
      (error) => {
        console.error('Error al cargar las vacunas:', error);
      }
    );
  }  

  addItem(): void {
    const nuevaVacuna: Vacuna = {
      id: 0,  // El id se genera automáticamente en el backend
      nombre: 'MODERNA',
      laboratorio: 'N/A',
      lote: 'yyyyyyy',
      dosisDisponibles: 20,
      fechaRegistro: new Date(),
    };
    this.vacunaService.addVacuna(nuevaVacuna).subscribe(() => {
      this.loadVacunas(); // Recargar las vacunas después de agregar
    });
  }

  editItem(id: number): void {
    this.vacunaService.getVacunaById(id).subscribe((vacuna) => {
      if (vacuna) {
        const vacunaEditada: Vacuna = { ...vacuna, nombre: 'Actualizado' };
        this.vacunaService.editVacuna(id, vacunaEditada).subscribe(() => {
          this.loadVacunas(); // Recargar las vacunas después de editar
        });
      }
    });
  }

  deleteItem(id: number): void {
    this.vacunaService.deleteVacuna(id).subscribe(() => {
      this.loadVacunas(); // Recargar las vacunas después de eliminar
    });
  }
}