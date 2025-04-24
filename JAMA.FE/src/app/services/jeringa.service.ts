import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JeringaService {
  private apiUrl = `${environment.endpoint}/api/jeringa`;

  constructor(private http: HttpClient) { }

  getJeringas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getJeringaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
