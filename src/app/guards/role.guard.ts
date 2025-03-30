import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];
    const user = this.loginService.getUserFromToken();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (user.rolUser === requiredRole) {
      return true;
    }

    // Si el rol no coincide, redirigir a página no autorizada
    this.router.navigate(['/404']);
    return false;
  }
}
