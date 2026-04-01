import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PecasService } from '../../services/pecas.service';
import { StockService } from '../../services/stock.service';
import { PedidosService } from '../../services/pedidos.service';
import { MotasService } from '../../services/motas.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  tabAtiva: string = 'pecas';
  piloto: any;

  // Dados
  pecas: any[] = [];
  stock: any[] = [];
  pedidosPendentes: any[] = [];
  historico: any[] = [];
  motas: any[] = [];
  motaPiloto: any = null;
  pecaSelecionada: any = null;
  stockDisponivelPeca: any[] = [];
  mostrarModalPedido: boolean = false;
  pilotos: any[] = [];
  todoPStock: any[] = [];

  // Filtros
  categorias = [
    'Motor',
    'Suspensão',
    'Transmissão',
    'Eletrónica',
    'Travões',
    'Lubrificação',
    'Rodas e Pneus',
    'Ferramentas',
    'Outros',
  ];
  categoriaFiltro: string = '';

  // Formulários
  novaPecaForm: FormGroup;
  novoStockForm: FormGroup;
  mostrarFormPeca: boolean = false;
  mostrarFormStock: boolean = false;

  // Estado
  aCarregar: boolean = false;
  mensagem: string = '';
  erro: string = '';

  constructor(
    private authService: AuthService,
    private pecasService: PecasService,
    private stockService: StockService,
    private pedidosService: PedidosService,
    private motasService: MotasService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
    this.piloto = this.authService.getPiloto();

    this.novaPecaForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: [''],
      categoria: ['', Validators.required],
      part_number: ['', Validators.required],
      universal: [false],
      id_mota: [''],
    });

    this.novoStockForm = this.fb.group({
      id_peca: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      notas: [''],
    });
  }

  ngOnInit(): void {
    this.carregarMotasPiloto();
    this.carregarPecas();
    this.carregarStock();
    this.carregarPedidos();
    this.carregarHistorico();
    this.carregarPilotos();
  }

  mudarTab(tab: string): void {
    this.tabAtiva = tab;
    this.mensagem = '';
    this.erro = '';
  }

  // --- Peças ---
  carregarPecas(): void {
    if (!this.piloto?.id_mota) {
      this.pecas = [];
      return;
    }

    const filtros = this.categoriaFiltro ? { categoria: this.categoriaFiltro } : undefined;

    this.pecasService.getPecas(filtros).subscribe({
      next: (todasPecas) => {
        // Buscar compatibilidades da mota do piloto
        this.http
          .get<any[]>(`${environment.apiUrl}/peca-mota/mota/${this.piloto.id_mota}`)
          .subscribe({
            next: (compatibilidades) => {
              const idsPecasCompativeis = compatibilidades.map((c: any) => c.id_peca);

              // Mostrar peças compatíveis com a mota OU universais
              this.pecas = todasPecas.filter(
                (p) => idsPecasCompativeis.includes(p.id) || p.universal === true,
              );
            },
            error: () => {
              // Se não houver compatibilidades, mostra só as universais
              this.pecas = todasPecas.filter((p) => p.universal === true);
            },
          });
      },
      error: () => (this.erro = 'Erro ao carregar peças'),
    });
  }

  filtrarCategoria(categoria: string): void {
    this.categoriaFiltro = this.categoriaFiltro === categoria ? '' : categoria;
    this.carregarPecas();
  }

  criarPeca(): void {
    if (this.novaPecaForm.invalid) return;

    const { nome, descricao, categoria, part_number, universal, id_mota } = this.novaPecaForm.value;

    this.pecasService.createPeca({ nome, descricao, categoria, part_number }).subscribe({
      next: (pecaCriada) => {
        // Se não for universal, associa à mota selecionada
        if (!universal && id_mota) {
          this.http
            .post(`${environment.apiUrl}/peca-mota`, {
              id_peca: pecaCriada.id,
              id_mota: id_mota,
            })
            .subscribe({
              next: () => {
                this.mensagem = 'Peça criada e associada à mota!';
                this.mostrarFormPeca = false;
                this.novaPecaForm.reset();
                this.carregarPecas();
              },
              error: () => (this.erro = 'Peça criada mas erro ao associar à mota'),
            });
        } else {
          this.mensagem = 'Peça universal criada com sucesso!';
          this.mostrarFormPeca = false;
          this.novaPecaForm.reset();
          this.carregarPecas();
        }
      },
      error: (err) => (this.erro = err.error?.error ?? 'Erro ao criar peça'),
    });
  }

  pedirEmprestimo(peca: any): void {
    this.pecaSelecionada = peca;
    this.stockDisponivelPeca = [];
    this.erro = '';

    this.stockService.getStock({ id_peca: peca.id }).subscribe({
      next: (items) => {
        const disponiveis = items.filter(
          (i: any) => i.id_proprietario !== this.piloto.id && i.disponivel && i.quantidade > 0,
        );

        // Enriquecer com dados do piloto proprietário
        this.stockDisponivelPeca = disponiveis.map((item: any) => {
          const piloto = this.pilotos.find((p) => p.id === item.id_proprietario);
          return {
            ...item,
            nome_proprietario: piloto
              ? `#${piloto.nr_piloto} ${piloto.nome}`
              : 'Piloto desconhecido',
            telemovel_proprietario: piloto?.telemovel ?? null,
          };
        });

        this.mostrarModalPedido = true;
      },
      error: () => (this.erro = 'Erro ao procurar stock disponível'),
    });
  }

  //--Emprestimo--
  confirmarPedido(item: any, quantidade: number): void {
    if (!this.piloto) return;

    if (quantidade < 1 || quantidade > item.quantidade) {
      this.erro = `Quantidade inválida. Máximo disponível: ${item.quantidade}`;
      return;
    }

    this.pedidosService
      .criarPedido({
        id_item_stock: item.id,
        id_piloto: this.piloto.id,
        quantidade,
      })
      .subscribe({
        next: () => {
          this.mensagem = 'Pedido enviado com sucesso!';
          this.mostrarModalPedido = false;
          this.pecaSelecionada = null;
          this.carregarHistorico();
        },
        error: (err) => (this.erro = err.error?.error ?? 'Erro ao fazer pedido'),
      });
  }

  fecharModal(): void {
    this.mostrarModalPedido = false;
    this.pecaSelecionada = null;
    this.stockDisponivelPeca = [];
  }

  // --- Stock ---
  carregarMotasPiloto(): void {
    this.motasService.getMotas().subscribe({
      next: (data) => {
        this.motas = data;
        if (this.piloto?.id_mota) {
          this.motaPiloto = data.find((m: any) => m.id === this.piloto.id_mota);
        }
      },
      error: () => {},
    });
  }

  carregarStock(): void {
    if (!this.piloto) return;
    this.stockService.getStock({ id_proprietario: this.piloto.id }).subscribe({
      next: (data) => (this.stock = data),
      error: () => (this.erro = 'Erro ao carregar stock'),
    });
  }

  adicionarStock(): void {
    if (this.novoStockForm.invalid) return;
    const dados = {
      ...this.novoStockForm.value,
      id_proprietario: this.piloto.id,
      disponivel: true,
    };
    this.stockService.createItemStock(dados).subscribe({
      next: () => {
        this.mensagem = 'Item adicionado ao stock!';
        this.mostrarFormStock = false;
        this.novoStockForm.reset({ quantidade: 1 });
        this.carregarStock();
      },
      error: (err) => (this.erro = err.error?.error ?? 'Erro ao adicionar stock'),
    });
  }

  toggleDisponivel(item: any): void {
    this.stockService.updateItemStock(item.id, { disponivel: !item.disponivel }).subscribe({
      next: () => this.carregarStock(),
      error: () => (this.erro = 'Erro ao atualizar item'),
    });
  }

  removerStock(id: string): void {
    this.stockService.deleteItemStock(id).subscribe({
      next: () => {
        this.mensagem = 'Item removido do stock!';
        this.carregarStock();
      },
      error: () => (this.erro = 'Erro ao remover item'),
    });
  }

  // --- Pedidos ---
  carregarPedidos(): void {
    if (!this.piloto) return;
    this.http
      .get<any[]>(`${environment.apiUrl}/pedidos?id_proprietario=${this.piloto.id}`)
      .subscribe({
        next: (pedidos) => {
          this.pedidosPendentes = pedidos;

          // Carregar o stock do proprietário para conseguir mostrar nomes das peças
          this.http
            .get<any[]>(`${environment.apiUrl}/stock?id_proprietario=${this.piloto.id}`)
            .subscribe({
              next: (items) => (this.todoPStock = items),
              error: () => {},
            });
        },
        error: () => (this.erro = 'Erro ao carregar pedidos'),
      });
  }

  responderPedido(id: string, status: string): void {
    this.pedidosService.responderPedido(id, status).subscribe({
      next: () => {
        this.mensagem = `Pedido ${status.toLowerCase()} com sucesso!`;
        this.carregarPedidos();
        this.carregarStock();
      },
      error: () => (this.erro = 'Erro ao responder ao pedido'),
    });
  }

  // --- Histórico ---
  carregarHistorico(): void {
    if (!this.piloto) return;
    this.pedidosService.getHistorico(this.piloto.id).subscribe({
      next: async (data: any) => {
        // Para os pedidos feitos, buscar o item de stock para conseguir o nome da peça
        const feitos = await Promise.all(
          data.feitos.map(async (p: any) => {
            // Verifica se o item já está no todoPStock
            const jaExiste = this.todoPStock.find((s) => s.id === p.id_item_stock);
            if (!jaExiste) {
              try {
                const item = await this.http
                  .get<any>(`${environment.apiUrl}/stock/${p.id_item_stock}`)
                  .toPromise();
                if (item) this.todoPStock.push(item);
              } catch {}
            }
            return { ...p, tipo: 'feito' };
          }),
        );

        const recebidos = data.recebidos.map((p: any) => ({ ...p, tipo: 'recebido' }));

        this.historico = [...feitos, ...recebidos].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      },
      error: () => (this.erro = 'Erro ao carregar histórico'),
    });
  }

  getNomePeca(id_peca: string): string {
    const peca = this.pecas.find((p) => p.id === id_peca);
    return peca ? peca.nome : id_peca;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // --explode view--
  downloadCatalogo(): void {
    if (this.motaPiloto?.url_documento) {
      window.open(this.motaPiloto.url_documento, '_blank');
    }
  }

  //--Pilotos--
  carregarPilotos(): void {
    this.http.get<any[]>(`${environment.apiUrl}/pilotos`).subscribe({
      next: (data) => (this.pilotos = data),
      error: () => {},
    });
  }

  getNomePiloto(id: string): string {
    const piloto = this.pilotos.find((p) => p.id === id);
    return piloto ? `#${piloto.nr_piloto} ${piloto.nome}` : id;
  }

  getPecaDoItem(id_item_stock: string): string {
    const item = this.todoPStock.find((s) => s.id === id_item_stock);
    if (!item) return 'Peça desconhecida';
    const peca = this.pecas.find((p) => p.id === item.id_peca);
    return peca ? `${peca.nome} (${peca.part_number})` : 'Peça desconhecida';
  }
}
