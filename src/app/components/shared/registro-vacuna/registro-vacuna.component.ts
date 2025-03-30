import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { EsquemaVacunacionService } from '../../../services/esquema-vacunacion.service';
import { EsquemaVacunacion } from '../../../models/esquema-vacunacion';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ValidationMessages } from '../form-validation-messages';

@Component({
  selector: 'app-registro-vacuna',
  templateUrl: './registro-vacuna.component.html',
  styleUrls: ['./registro-vacuna.component.css']
})
export class RegistroVacunaComponent implements OnInit {
  esquemaForm: FormGroup;
  isEnfermera: boolean = false;
  formMessage: string = '';
  formStatus: 'success' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private esquemaService: EsquemaVacunacionService,
    private router: Router
  ) {
    this.esquemaForm = this.initForm(); // Inicializar aquí el formulario
    this.isEnfermera = this.router.url.includes('/enfermera/');
  }

  ngOnInit(): void {
    // No es necesario inicializar el formulario aquí ya que se hace en el constructor
  }

  private initForm(): FormGroup {
    return this.fb.group({
      tipoCarnet: ['', Validators.required],
      responsable: ['', Validators.required],
      registradoPAI: [false],
      motivoNoIngreso: [''],
      observaciones: [''],
      pacienteId: ['', Validators.required],
      detalles: this.fb.array([])
    });
  }

  get detalles(): FormArray {
    return this.esquemaForm.get('detalles') as FormArray;
  }

  agregarDetalle(): void {
    const detalleGroup = this.fb.group({
      vacunaId: ['', Validators.required],
      cantidadUtilizadaVacuna: [0, Validators.min(0)],
      sueroId: [''],
      cantidadUtilizadaSuero: [0, Validators.min(0)],
      diluyenteId: [''],
      cantidadUtilizadaDiluyente: [0, Validators.min(0)],
      jeringaId: [''],
      cantidadUtilizadaJeringa: [0, Validators.min(0)]
    });

    this.detalles.push(detalleGroup);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.esquemaForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.esquemaForm.get(fieldName);
    if (control && control.errors) {
      const firstError = Object.keys(control.errors)[0];
      return ValidationMessages[firstError as keyof typeof ValidationMessages];
    }
    return '';
  }

  guardarEsquema(): void {
    if (this.esquemaForm.invalid) {
      this.markFormGroupTouched(this.esquemaForm);
      this.showMessage('Por favor, complete todos los campos requeridos', 'error');
      return;
    }

    this.esquemaService.addEsquema(this.esquemaForm.value).subscribe(
      response => {
        Swal.fire('Éxito', 'Esquema de vacunación guardado correctamente', 'success');
      },
      error => {
        console.error('Error:', error);
        Swal.fire('Error', 'No se pudo guardar el esquema de vacunación', 'error');
      }
    );
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  private showMessage(message: string, status: 'success' | 'error'): void {
    this.formMessage = message;
    this.formStatus = status;
    setTimeout(() => {
      this.formMessage = '';
      this.formStatus = '';
    }, 3000);
  }
}
