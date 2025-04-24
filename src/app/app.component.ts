import { Component } from '@angular/core';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public loginService: LoginService) {}
  title = 'JAMA';
  isLoading: boolean = false;  // Añadir esta propiedad
}
