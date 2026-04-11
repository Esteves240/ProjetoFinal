// intermediário entre o dashboard e a API do backend para tudo o que diz respeito a peças.  Em vez de cada componente fazer chamadas HTTP diretamente, centraliza toda a lógica de comunicação num só sítio
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// @Injectable providedIn: 'root' significa que existe uma única instância deste
// serviço em toda a aplicação — não precisas de o declarar em nenhum módulo
@Injectable({
  providedIn: 'root',
})
export class PecasService {
  // URL base da API — em desenvolvimento aponta para localhost,
  // em produção aponta para o Render (definido nos ficheiros environment)
  private apiUrl = environment.apiUrl;

  // O HttpClient é injetado automaticamente pelo Angular para fazer pedidos HTTP
  constructor(private http: HttpClient) {}

  // Devolve a lista de peças com filtros opcionais.
  // Os filtros são enviados como query parameters no URL
  // ex: GET /pecas?categoria=Motor
  getPecas(filtros?: { categoria?: string }): Observable<any[]> {
    let params = new HttpParams();
    if (filtros?.categoria) params = params.set('categoria', filtros.categoria);
    return this.http.get<any[]>(`${this.apiUrl}/pecas`, { params });
  }

  // Devolve o detalhe de uma peça específica pelo seu UUID
  // ex: GET /pecas/abc-123
  getPeca(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pecas/${id}`);
  }

  // Cria uma nova peça no catálogo.
  // O body deve incluir: nome, descricao, categoria, part_number
  // ex: POST /pecas
  createPeca(peca: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/pecas`, peca);
  }

  // Atualiza os dados de uma peça existente pelo seu ID
  // ex: PUT /pecas/abc-123
  updatePeca(id: string, peca: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/pecas/${id}`, peca);
  }

  // Elimina uma peça do catálogo pelo seu ID
  // ex: DELETE /pecas/abc-123
  deletePeca(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/pecas/${id}`);
  }
}
