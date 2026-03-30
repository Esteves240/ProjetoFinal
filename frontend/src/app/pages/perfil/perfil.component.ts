import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PilotosService } from '../../services/pilotos.service';
import { MotasService } from '../../services/motas.service';
import { PecasService } from '../../services/pecas.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  piloto: any;
  motas: any[] = [];
  equipas: any[] = [];
  mensagem: string = '';
  erro: string = '';
  aCarregar: boolean = false;
  motaAtual: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private pilotosService: PilotosService,
    private motasService: MotasService,
    private router: Router,
  ) {
    this.piloto = this.authService.getPiloto();

    this.perfilForm = this.fb.group({
      nome: [this.piloto?.nome ?? '', Validators.required],
      nr_piloto: [this.piloto?.nr_piloto ?? '', Validators.required],
      telemovel: [this.piloto?.telemovel ?? ''],
      id_mota: [this.piloto?.id_mota ?? ''],
      id_equipa: [this.piloto?.id_equipa ?? ''],
    });
  }

  ngOnInit(): void {
    this.carregarMotas();
  }

  carregarMotas(): void {
    this.motasService.getMotas().subscribe({
      next: (data) => {
        this.motas = data;
        if (this.piloto?.id_mota) {
          this.motaAtual = data.find((m: any) => m.id === this.piloto.id_mota);
        }
      },
      error: () => (this.erro = 'Erro ao carregar motas'),
    });
  }

  //no needed
  onMotaChange(event: any): void {
    const id = event.target.value;
    this.motaAtual = this.motas.find((m) => m.id === id) ?? null;
  }

  guardar(): void {
    if (this.perfilForm.invalid) return;

    this.aCarregar = true;
    this.mensagem = '';
    this.erro = '';

    this.pilotosService.updatePiloto(this.piloto.id, this.perfilForm.value).subscribe({
      next: (data) => {
        // Atualiza o piloto no localStorage
        localStorage.setItem('piloto', JSON.stringify(data));
        this.piloto = data;
        this.mensagem = 'Perfil atualizado com sucesso!';
        this.aCarregar = false;
      },
      error: (err) => {
        this.erro = err.error?.error ?? 'Erro ao atualizar perfil';
        this.aCarregar = false;
      },
    });
  }

  voltarDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
