import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-enfermera',
  templateUrl: './enfermera.component.html',
  styleUrls: ['./enfermera.component.css'],
  providers: [DatePipe]
})
export class EnfermeraComponent implements OnInit {
  user: any = null;
  lastLogin: string | null = null;
  formattedLastLogin: string | null = null;

  constructor(private loginService: LoginService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.user = this.loginService.getUserFromToken();
    this.lastLogin = this.loginService.getLastLoginFromLocalStorage();
    if (this.lastLogin) {
      this.formattedLastLogin = this.datePipe.transform(this.lastLogin, 'dd/MM/yyyy');
    }
  }
}
