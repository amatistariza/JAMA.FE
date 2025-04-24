import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Diluyente } from '../../../../models/diluyente';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationMessages } from '../../../shared/form-validation-messages';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-diluyente-form',
  templateUrl: './diluyente-form.component.html',
  styleUrl: './diluyente-form.component.css'
})
export class DiluyenteFormComponent implements OnInit {
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Input() diluyente: Diluyente = {
    id: 0,
    nombre: '',
    lote: '',
    cantidadDisponible: 0,
  };
  @Output() onGuardar = new EventEmitter<Diluyente>();
  @Output() onCancelar = new EventEmitter<void>();

  diluyenteForm: FormGroup;
  formMessage: string = '';
  formStatus: 'success' | 'error' | '' = '';

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {}

  private initForm(): void {
    this.diluyenteForm = this.fb.group({
      nombre: ['', [Validators.required]],
      lote: ['', [Validators.required]],
      cantidadDisponible: [0, [Validators.required, Validators.min(0)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.diluyenteForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.diluyenteForm.get(fieldName);
    if (control && control.errors) {
      const firstError = Object.keys(control.errors)[0];
      return ValidationMessages[firstError as keyof typeof ValidationMessages];
    }
    return '';
  }

  guardar(): void {
    Swal.fire({
      title: this.modo === 'crear' ? '¿Deseas añadir este diluyente?' : '¿Deseas guardar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.onGuardar.emit(this.diluyente);
        Swal.fire('¡Hecho!', `Diluyente ${this.modo === 'crear' ? 'añadida' : 'actualizada'} con éxito.`, 'success');
      }
    });
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
