import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  myAppUrl: string;
  myApiUrl: string;

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/Login';
  }

  // Método para verificar si estamos en el navegador
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  login(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}`, usuario);
  }

  setLocalStorage(token: string): void {
    localStorage.setItem('token', token); // Guardar el token
    localStorage.setItem('lastLogin', new Date().toISOString()); // Guardar la fecha de última conexión
    console.log('Token guardado:', token); // Verifica que el token se haya guardado correctamente
  }  

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }

  getTokenDecoded(): any {
    const token = this.getToken();
    return token ? this.jwtHelper.decodeToken(token) : null;
  }

  getUserIdFromToken(): string | null {
    const decodedToken = this.getTokenDecoded();
    console.log('Token decodificado:', decodedToken); // Asegúrate de ver lo que contiene el token
    return decodedToken ? decodedToken.idUsuario : null; // Cambia 'idUsuario' por el campo correcto
  }
  
  getUserFromToken(): Usuario | null {
    const decodedToken = this.getTokenDecoded();
    console.log('Token decodificado:', decodedToken); // Verifica que el token se haya decodificado correctamente
    
    if (decodedToken) {
      return {
        id: decodedToken.idUsuario, // Asegúrate de que 'idUsuario' sea el campo correcto
        nombreUsuario: decodedToken.sub, // 'sub' contiene el nombre de usuario
        rolUser: decodedToken.rolUsuario, // 'rolUsuario' contiene el rol
        password: '' // No guardes la contraseña por razones de seguridad
      };
    }
    return null;
  }  

  getLastLoginFromLocalStorage(): string | null {
    return this.isBrowser() ? localStorage.getItem('lastLogin') : null;
  }

  removeLocalStorage(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('lastLogin');
    }
  }
}