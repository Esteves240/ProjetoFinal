import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPedidos(id_piloto?: string): Observable<any[]> {
    let params = new HttpParams();
    if (id_piloto) params = params.set('id_piloto', id_piloto);
    return this.http.get<any[]>(`${this.apiUrl}/pedidos`, { params });
  }

  criarPedido(pedido: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/pedidos`, pedido);
  }

  responderPedido(id: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/pedidos/${id}`, { status });
  }

  getHistorico(id_piloto: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pedidos/historico/${id_piloto}`);
  }
}
