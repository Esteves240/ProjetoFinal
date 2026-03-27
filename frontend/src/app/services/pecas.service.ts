import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PecasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPecas(filtros?: { categoria?: string }): Observable<any[]> {
    let params = new HttpParams();
    if (filtros?.categoria) params = params.set('categoria', filtros.categoria);
    return this.http.get<any[]>(`${this.apiUrl}/pecas`, { params });
  }

  getPeca(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pecas/${id}`);
  }

  createPeca(peca: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/pecas`, peca);
  }

  updatePeca(id: string, peca: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/pecas/${id}`, peca);
  }

  deletePeca(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/pecas/${id}`);
  }
}
