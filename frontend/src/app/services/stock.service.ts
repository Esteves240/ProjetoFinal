import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStock(filtros?: { id_peca?: string; id_proprietario?: string }): Observable<any[]> {
    let params = new HttpParams();
    if (filtros?.id_peca) params = params.set('id_peca', filtros.id_peca);
    if (filtros?.id_proprietario) params = params.set('id_proprietario', filtros.id_proprietario);
    return this.http.get<any[]>(`${this.apiUrl}/stock`, { params });
  }

  createItemStock(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/stock`, item);
  }

  updateItemStock(id: string, item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/stock/${id}`, item);
  }

  deleteItemStock(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/stock/${id}`);
  }
}
