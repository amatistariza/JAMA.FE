import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacunaService {
  private apiUrl = `${environment.endpoint}/api/vacuna`;

  constructor(private http: HttpClient) { }

  getVacunas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getVacunaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
