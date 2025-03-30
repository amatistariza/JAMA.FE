import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Madre } from '../../../../../../models/madre';
import { ValidationMessages } from '../../../../../shared/form-validation-messages';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-madre-form',
  templateUrl: './madre-form.component.html',
  styleUrl: './madre-form.component.css'
})
export class MadreFormComponent implements OnInit {
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Input() madre: Madre = {
    id: 0,
    tipoIdentificacion: '',
    numeroIdentificacion: 0,
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',    
    correoElectronico: '',
    indicativoTelefono: 0,
    telefonoFijo: 0,
    celular: 0,
    regimenAfiliacion: '',
    pertenenciaEtnica: '',
    desplazado: false
  };
  @Output() onGuardar = new EventEmitter<Madre>(); // Evento para guardar
  @Output() onCancelar = new EventEmitter<void>(); // Evento para cancelar

  madreForm: FormGroup;
  formMessage: string = '';
  formStatus: 'success' | 'error' | '' = '';

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {}

  private initForm(): void {
    this.madreForm = this.fb.group({
      tipoIdentificacion: ['', [Validators.required]],
      numeroIdentificacion: ['', [Validators.required, Validators.minLength(5)]],
      primerNombre: ['', [Validators.required, Validators.minLength(2)]],
      segundoNombre: [''],
      primerApellido: ['', [Validators.required, Validators.minLength(2)]],
      segundoApellido: [''],
      correoElectronico: ['', [Validators.required, Validators.email]],
      indicativoTelefono: ['', [Validators.required]],
      telefonoFijo: ['', [Validators.required]],
      celular: ['', [Validators.required]],
      regimenAfiliacion: ['', [Validators.required]],
      pertenenciaEtnica: ['', [Validators.required]],
      desplazado: [false]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.madreForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.madreForm.get(fieldName);
    if (control && control.errors) {
      const firstError = Object.keys(control.errors)[0];
      return ValidationMessages[firstError as keyof typeof ValidationMessages];
    }
    return '';
  }

  guardar(): void {
    Swal.fire({
      title: this.modo === 'crear' ? '¿Deseas añadir esta madre?' : '¿Deseas guardar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.onGuardar.emit(this.madre);
        Swal.fire('¡Hecho!', `Madre ${this.modo === 'crear' ? 'añadida' : 'actualizada'} con éxito.`, 'success');
      }
    });
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
