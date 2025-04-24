import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css']
})
export class CambiarPasswordComponent {
  cambiarPasswordForm: FormGroup;
  showModal = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.cambiarPasswordForm = this.fb.group({
      passwordAnterior: ['', Validators.required],
      nuevaPassword: ['', Validators.required],
      confirmarPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('nuevaPassword')?.value === g.get('confirmarPassword')?.value
      ? null : {'mismatch': true};
  }

  mostrarModal(): void {
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.cambiarPasswordForm.reset();
  }

  onSubmit(): void {
    if (this.cambiarPasswordForm.valid) {
      const { passwordAnterior, nuevaPassword } = this.cambiarPasswordForm.value;
      
      this.usuarioService.cambiarPassword({ passwordAnterior, nuevaPassword }).subscribe({
        next: (response) => {
          Swal.fire('Éxito', 'Contraseña cambiada correctamente', 'success');
          this.cerrarModal();
        },
        error: (error) => {
          Swal.fire('Error', error.error.message || 'Error al cambiar la contraseña', 'error');
        }
      });
    }
  }
}
