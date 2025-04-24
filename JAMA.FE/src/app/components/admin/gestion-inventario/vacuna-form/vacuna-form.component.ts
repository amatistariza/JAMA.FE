import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Vacuna } from '../../../../models/vacuna';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationMessages } from '../../../shared/form-validation-messages';

@Component({
  selector: 'app-vacuna-form',
  templateUrl: './vacuna-form.component.html',
  styleUrls: ['./vacuna-form.component.css'],
})
export class VacunaFormComponent implements OnInit {
  @Input() modo: 'crear' | 'editar' = 'crear'; // Modo del formulario
  @Input() vacuna: Vacuna = {
    id: 0,
    nombre: '',
    laboratorio: '',
    lote: '',
    dosisDisponibles: 0,
    fechaRegistro: new Date(),
  }; // Vacuna inicial
  @Output() onGuardar = new EventEmitter<Vacuna>(); // Evento para guardar
  @Output() onCancelar = new EventEmitter<void>(); // Evento para cancelar

  vacunaForm: FormGroup;
  formMessage: string = '';
  formStatus: 'success' | 'error' | '' = '';

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {}

  private initForm(): void {
    this.vacunaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      laboratorio: ['', [Validators.required]],
      lote: ['', [Validators.required]],
      dosisDisponibles: [0, [Validators.required, Validators.min(0)]],
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.vacunaForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.vacunaForm.get(fieldName);
    if (control && control.errors) {
      const firstError = Object.keys(control.errors)[0];
      return ValidationMessages[firstError as keyof typeof ValidationMessages];
    }
    return '';
  }

  guardar(): void {
    Swal.fire({
      title: this.modo === 'crear' ? '¿Deseas añadir esta vacuna?' : '¿Deseas guardar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.onGuardar.emit(this.vacuna);
        Swal.fire('¡Hecho!', `Vacuna ${this.modo === 'crear' ? 'añadida' : 'actualizada'} con éxito.`, 'success');
      }
    });
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
