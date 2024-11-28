import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(username: string, password: string): Observable<{ success: boolean }> {
    if (username === 'admin' && password === '123') {
      return of({ success: true });
    } else {
      return of({ success: false });
    }
  }
}
