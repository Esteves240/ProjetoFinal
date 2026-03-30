import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PilotosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPiloto(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pilotos/${id}`);
  }

  updatePiloto(id: string, dados: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/pilotos/${id}`, dados);
  }
}
