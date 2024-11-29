import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario';
import { LoginService } from '../services/login.service'; // Ajusta la ruta

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rolUser: ['', Validators.required]
    });
  }

  // Método llamado al enviar el formulario
  onSubmit() {
    console.log('Formulario enviado:', this.loginForm.value);
  
    if (this.loginForm.valid) {
      const usuario: Usuario = {
        id: 0, // El Id no es necesario para el login
        nombreUsuario: this.loginForm.value.username,
        rolUser: this.loginForm.value.rolUser,
        password: this.loginForm.value.password
      };
  
      this.loginService.login(usuario).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
  
          if (response.token) {
            this.loginService.setLocalStorage(response.token); // Guardar el token y la fecha de última conexión en localStorage
  
            // Obtener la ID del usuario del token
            const userId = this.loginService.getUserIdFromToken();
            if (userId) {
              // Redirigir a una ruta que incluya la ID del usuario
              this.router.navigate([`/admin/${userId}/home`]);
            } else {
              alert('No se pudo obtener la ID del usuario');
            }
          } else {
            alert('Credenciales inválidas');
          }
        },
        error: (err) => {
          console.error('Error del servidor:', err);
          alert('Ocurrió un error al intentar iniciar sesión');
        }
      });
    }
  }
}