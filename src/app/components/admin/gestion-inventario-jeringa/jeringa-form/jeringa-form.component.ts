import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Jeringa } from '../../../../models/jeringa';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationMessages } from '../../../shared/form-validation-messages';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-jeringa-form',
  templateUrl: './jeringa-form.component.html',
  styleUrl: './jeringa-form.component.css'
})
export class JeringaFormComponent implements OnInit {
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Input() jeringa: Jeringa = {
    id: 0,
    tipo: '',
    lote: '',
    cantidadDisponible: 0,
  };
  @Output() onGuardar = new EventEmitter<Jeringa>();
  @Output() onCancelar = new EventEmitter<void>();

  jeringaForm: FormGroup;
  formMessage: string = '';
  formStatus: 'success' | 'error' | '' = '';

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {}

  private initForm(): void {
    this.jeringaForm = this.fb.group({
      tipo: ['', [Validators.required]],
      lote: ['', [Validators.required]],
      cantidadDisponible: [0, [Validators.required, Validators.min(0)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.jeringaForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.jeringaForm.get(fieldName);
    if (control && control.errors) {
      const firstError = Object.keys(control.errors)[0];
      return ValidationMessages[firstError as keyof typeof ValidationMessages];
    }
    return '';
  }

  guardar(): void {
    Swal.fire({
      title: this.modo === 'crear' ? '¿Deseas añadir este jeringa?' : '¿Deseas guardar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.onGuardar.emit(this.jeringa);
        Swal.fire('¡Hecho!', `Jeringa ${this.modo === 'crear' ? 'añadida' : 'actualizada'} con éxito.`, 'success');
      }
    });
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
