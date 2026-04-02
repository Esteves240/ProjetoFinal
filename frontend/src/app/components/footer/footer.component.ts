import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer>
      <div class="footer-content">
        <span>PaddockShare</span>
        <span class="separador">·</span>
        <span>Feito para o paddock, por pilotos, para pilotos</span>
        <span class="separador">·</span>
        <span>{{ ano }}</span>
      </div>
    </footer>
  `,
  styles: [
    `
      footer {
        background-color: #1a1a1a;
        color: #666;
        padding: 1rem 2rem;
        text-align: center;
        font-size: 0.85rem;
      }

      .footer-content {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .separador {
        color: #e85d04;
      }
    `,
  ],
})
export class FooterComponent {
  ano = new Date().getFullYear();
}
