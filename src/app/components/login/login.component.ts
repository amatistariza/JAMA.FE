import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Usuario } from '../../models/usuario';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rolUser: ['', Validators.required],
    });
  }

  onSubmit() {
    this.errorMessage = null; // Resetear errores al intentar iniciar sesión

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    const usuario: Usuario = {
      id: 0, // El ID no es necesario para login
      nombreUsuario: this.loginForm.value.username,
      rolUser: this.loginForm.value.rolUser as 'ADMINISTRADOR' | 'ENFERMERA', // Enlaza tipos estrictos
      password: this.loginForm.value.password,
    };

    this.loginService.login(usuario).subscribe({
      next: (response) => {
        if (response && response.token) {
          this.loginService.setLocalStorage(response.token);

          const userId = this.loginService.getUserIdFromToken();
          if (userId) {
            const rolePaths = {
              ADMINISTRADOR: `/admin/${userId}/home`,
              ENFERMERA: `/enfermera/${userId}/home`,
            };

            this.router.navigate([rolePaths[usuario.rolUser]]);
          } else {
            this.errorMessage = 'No se pudo obtener el ID del usuario.';
          }
        } else {
          // Si el backend devuelve un objeto con mensaje, mostrarlo
          let respMsg = '';
          try {
            if (response && typeof response === 'object') {
              respMsg = response.message || response.mensaje || response.msg || '';
            }
          } catch (e) {
            respMsg = '';
          }
          this.errorMessage = respMsg || 'Credenciales inválidas.';
        }
      },
      error: (err) => {
        console.error('Error del servidor:', err);

        // Caso: fallo de red / backend caído
        try {
          const msgLower = err && err.message ? err.message.toString().toLowerCase() : '';
          if ((err && (err.status === 0)) || msgLower.includes('failed to fetch')) {
            this.errorMessage = 'Verifique si el aplicativo está corriendo correctamente';
            return;
          }
        } catch (e) {
          // ignore and continue to extract other messages
        }

        let backendMsg = '';
        try {
          if (err && err.error) {
            if (typeof err.error === 'string') {
              try {
                const parsed = JSON.parse(err.error);
                backendMsg = parsed.message || parsed.mensaje || parsed.msg || parsed.error || '';
                if (!backendMsg && typeof parsed === 'string') backendMsg = parsed;
              } catch (e) {
                backendMsg = err.error;
              }
            } else if (typeof err.error === 'object') {
              backendMsg = err.error.message || err.error.mensaje || err.error.msg || JSON.stringify(err.error);
            }
          }
          if (!backendMsg && err && err.message) backendMsg = err.message;
        } catch (e) {
          backendMsg = '';
        }

        this.errorMessage = backendMsg ? backendMsg.toString() : 'Ocurrió un error al intentar iniciar sesión.';
      },
    });
  }
}
