import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h1>PaddockShare</h1>
      <p>Bem-vindo, {{ piloto?.nome }}!</p>
      <button (click)="logout()">Logout</button>
    </div>
  `,
})
export class DashboardComponent {
  piloto: any;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.piloto = this.authService.getPiloto();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
