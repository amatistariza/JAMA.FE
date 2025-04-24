import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    const token = this.loginService.getToken();
    
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decodedToken = this.loginService.getTokenDecoded();
      if (!decodedToken) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    } catch (error) {
      this.loginService.removeLocalStorage();
      this.router.navigate(['/login']);
      return false;
    }
  }
}
