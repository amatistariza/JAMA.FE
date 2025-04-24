import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SueroService {
  private apiUrl = `${environment.endpoint}/api/suero`;

  constructor(private http: HttpClient) { }

  getSueros(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSueroById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
