import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Usuario } from '../../../../models/usuario';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationMessages } from '../../../shared/form-validation-messages';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent implements OnInit {
  @Input() modo: 'crear' | 'editar' = 'crear'; // Modo del formulario
  @Output() onGuardar = new EventEmitter<Usuario>(); // Evento para guardar
  @Output() onCancelar = new EventEmitter<void>(); // Evento para cancelar

  usuarioForm: FormGroup;
  formMessage: string = '';
  formStatus: 'success' | 'error' | '' = '';

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit(): void {}

  private initForm(): void {
    this.usuarioForm = this.fb.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rolUser: ['', [Validators.required]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.usuarioForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.usuarioForm.get(fieldName);
    if (control && control.errors) {
      const firstError = Object.keys(control.errors)[0];
      return ValidationMessages[firstError as keyof typeof ValidationMessages];
    }
    return '';
  }

  guardar(): void {
    Swal.fire({
      title: this.modo === 'crear' ? '¿Deseas añadir este usuario?' : '¿Deseas guardar los cambios?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.onGuardar.emit(this.usuarioForm.value);
        Swal.fire('¡Hecho!', `Usuario ${this.modo === 'crear' ? 'añadido' : 'actualizado'} con éxito.`, 'success');
      }
    });
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
