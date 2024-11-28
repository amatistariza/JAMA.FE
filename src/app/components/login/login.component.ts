import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Ajusta la ruta

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router, // Inyecta Router
    private authService: AuthService // Servicio para autenticar (opcional)
  ) {
    // Inicializa el formulario reactivo
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // Método llamado al enviar el formulario
  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // Autenticación (puedes usar un servicio como AuthService)
      this.authService.login(username, password).subscribe({
        next: (response) => {
          if (response.success) { // Verifica si la respuesta es exitosa
            this.router.navigate(['/admin']); // Redirige a la página de admin
          } else {
            alert('Credenciales inválidas');
          }
        },
        error: () => {
          alert('Ocurrió un error al intentar iniciar sesión');
        }
      });
    }
  }
}
