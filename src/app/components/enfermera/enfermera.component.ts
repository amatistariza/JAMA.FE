import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Usuario } from '../../models/usuario';
import { DatePipe } from '@angular/common'; // Importar DatePipe
@Component({
  selector: 'app-enfermera',
  templateUrl: './enfermera.component.html',
  styleUrl: './enfermera.component.css'
})
export class EnfermeraComponent {
  user: Usuario | null = null;
  lastLogin: string | null = null;
  formattedLastLogin: string | null = null;

  constructor(private loginService: LoginService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    // Obtener el usuario desde el token
    this.user = this.loginService.getUserFromToken();
    console.log('Usuario recuperado:', this.user); // Verificar que el usuario se está recuperando correctamente
  
    // Obtener la fecha de última conexión desde localStorage
    this.lastLogin = this.loginService.getLastLoginFromLocalStorage();
  
    if (this.lastLogin) {
      // Formatear la fecha de última conexión
      this.formattedLastLogin = this.datePipe.transform(this.lastLogin, 'dd/MM/yyyy');
    }
  
    if (this.user) {
      console.log('Nombre de usuario desde token:', this.user.nombreUsuario); // Verifica que el nombre esté presente
      console.log('Última conexión:', this.formattedLastLogin); // Verifica que la fecha esté presente
    } else {
      console.error('No se encontró usuario desde el token');
    }
  }  
}
