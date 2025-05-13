import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Usuario } from '../../../../models/usuario';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationMessages } from '../../../shared/form-validation-messages';
import { GestionUsuarioService } from '../../../../services/gestion-usuario.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent implements OnInit {
  @Input() modo: 'crear' | 'editar' = 'crear';
  @Input() usuario: Usuario = this.inicializarUsuario();
  @Output() onGuardar = new EventEmitter<Usuario>();
  @Output() onCancelar = new EventEmitter<void>();

  usuarioForm: FormGroup;
  formMessage: string = '';
  formStatus: 'success' | 'error' | '' = '';


  constructor(private fb: FormBuilder, private usuarioService: GestionUsuarioService) {
    this.usuarioForm = this.fb.group({
      id: [0],
      nombreUsuario: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rolUser: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.usuarioForm = this.fb.group({
      id:[0],
      nombreUsuario: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', this.modo === 'crear' ? [Validators.required, Validators.minLength(6)] : []],
      rolUser: ['', Validators.required],
    });
    if (this.usuario) {
      this.usuarioForm.patchValue(this.usuario);
    }
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
    if (this.usuarioForm.invalid &&  this.modo === 'crear') {
      Swal.fire({
        title: 'Hay campos sin llenar',
        icon: 'warning',
        confirmButtonText: 'Volver a intentar',
      })
    } else {
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

  }

  cancelar(): void {
    Swal.fire({
      title: '¿Deseas salir este usuario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.onCancelar.emit();
      }
    });
  }

  inicializarUsuario(): Usuario {
    return {
      id: 0,
      nombreUsuario: '',
      password: '',
      rolUser: ''
    };
  }

  passwordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

}
