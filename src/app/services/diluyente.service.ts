import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiluyenteService {
  private apiUrl = `${environment.endpoint}/api/diluyente`;

  constructor(private http: HttpClient) { }

  getDiluyentes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getDiluyenteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
