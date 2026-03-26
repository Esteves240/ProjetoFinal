import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  erro: string = '';
  aCarregar: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        nome: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmarPassword: ['', [Validators.required]],
        nr_piloto: ['', [Validators.required, Validators.min(1)]],
        telemovel: [''],
      },
      { validators: this.passwordsIguais },
    );
  }

  passwordsIguais(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmar = form.get('confirmarPassword')?.value;
    return password === confirmar ? null : { passwordsDiferentes: true };
  }

  get nome() {
    return this.registerForm.get('nome');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmarPassword() {
    return this.registerForm.get('confirmarPassword');
  }
  get nr_piloto() {
    return this.registerForm.get('nr_piloto');
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.aCarregar = true;
    this.erro = '';

    const { nome, email, password, nr_piloto, telemovel } = this.registerForm.value;

    this.authService
      .register({ nome, email, password, nr_piloto: Number(nr_piloto), telemovel })
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.erro = err.error?.error ?? 'Erro ao registar. Tenta novamente.';
          this.aCarregar = false;
        },
      });
  }
}
