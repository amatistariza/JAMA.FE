import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Suero } from '../../../../models/suero';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationMessages } from '../../../shared/form-validation-messages';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-suero-form',
  templateUrl: './suero-form.component.html',
  styleUrl: './suero-form.component.css'
})
export class SueroFormComponent implements OnInit {
  @Input() modo: 'crear' | 'editar' = 'crear'; // Modo del formulario
  @Input() suero: Suero = {
    id: 0,
    nombre: '',
    lote: '',
    frascosDisponibles: 0,
  };
  @Output() onGuardar = new EventEmitter<Suero>(); // Evento para guardar
  @Output() onCancelar = new EventEmitter<void>(); // Evento para cancelar

  sueroForm: FormGroup;
  formMessage: string = '';
  formStatus: 'success' | 'error' | '' = '';

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {}

  private initForm(): void {
    this.sueroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      lote: ['', [Validators.required]],
      frascosDisponibles: [0, [Validators.required, Validators.min(0)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.sueroForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.sueroForm.get(fieldName);
    if (control && control.errors) {
      const firstError = Object.keys(control.errors)[0];
      return ValidationMessages[firstError as keyof typeof ValidationMessages];
    }
    return '';
  }

  guardar(): void {
    Swal.fire({
      title: this.modo === 'crear' ? '¿Deseas añadir este suero?' : '¿Deseas guardar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.onGuardar.emit(this.suero);
        Swal.fire('¡Hecho!', `Suero ${this.modo === 'crear' ? 'añadida' : 'actualizada'} con éxito.`, 'success');
      }
    });
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
