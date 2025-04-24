import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
        if (response.token) {
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
          this.errorMessage = 'Credenciales inválidas.';
        }
      },
      error: (err) => {
        console.error('Error del servidor:', err);
        this.errorMessage = 'Ocurrió un error al intentar iniciar sesión.';
      },
    });
  }
}
