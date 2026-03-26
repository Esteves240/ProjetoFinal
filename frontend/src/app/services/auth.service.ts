//ponte entre o Angular e o backend
//tap — depois de receber a resposta do backend, guarda o token e os dados do piloto no localStorage

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(dados: {
    email: string;
    password: string;
    nome: string;
    nr_piloto: number;
    id_equipa?: string;
    telemovel?: string;
    id_mota?: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, dados).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('piloto', JSON.stringify(res.piloto));
      }),
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('piloto', JSON.stringify(res.piloto));
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('piloto');
  }

  //verifica se existe um token guardado. É isto que o AuthGuard vai usar
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getPiloto(): any {
    const piloto = localStorage.getItem('piloto');
    return piloto ? JSON.parse(piloto) : null;
  }
}
