import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AddTokenInterceptor implements HttpInterceptor {
  
  constructor(private jwtHelper: JwtHelperService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = null;

    // Verificar si estamos en el navegador
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      token = localStorage.getItem('token');
    }

    // Si hay un token, agregarlo al encabezado de la solicitud
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
