import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// Serviços
import { AuthService } from '../../services/auth.service';
import { PecasService } from '../../services/pecas.service';
import { StockService } from '../../services/stock.service';
import { PedidosService } from '../../services/pedidos.service';
import { MotasService } from '../../services/motas.service';
// Angular HTTP e ambiente
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
// Componentes partilhados
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FooterComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  // ─── Estado da navegação ───────────────────────────────────────────────────
  tabAtiva: string = 'pecas';
  piloto: any; // Dados do piloto autenticado (vindos do localStorage)

  // ─── Dados carregados do backend ───────────────────────────────────────────
  pecas: any[] = []; // Todas as peças compatíveis com a mota do piloto
  pecasFiltradas: any[] = []; // Peças após aplicar filtros de pesquisa
  stock: any[] = []; // Stock do próprio piloto
  todoPStock: any[] = []; // Stock de outros pilotos (usado no histórico e pedidos)
  pedidosPendentes: any[] = []; // Pedidos de empréstimo à espera de resposta
  historico: any[] = []; // Histórico de pedidos feitos e recebidos
  motas: any[] = []; // Lista de todas as motas disponíveis
  motaPiloto: any = null; // Mota associada ao piloto autenticado
  pilotos: any[] = []; // Lista de todos os pilotos (para mostrar nomes)

  // ─── Estado do modal de pedido ─────────────────────────────────────────────
  pecaSelecionada: any = null; // Peça que o piloto quer pedir emprestada
  stockDisponivelPeca: any[] = []; // Itens de stock disponíveis para essa peça
  mostrarModalPedido: boolean = false;

  // ─── Filtros ───────────────────────────────────────────────────────────────
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
  categoriaFiltro: string = ''; // Categoria selecionada ('' = todas)
  partNumberFiltro: string = ''; // Texto de pesquisa por part number ou nome

  // ─── Formulários ───────────────────────────────────────────────────────────
  novaPecaForm: FormGroup;
  novoStockForm: FormGroup;
  mostrarFormPeca: boolean = false;
  mostrarFormStock: boolean = false;

  // ─── Estado de UI ──────────────────────────────────────────────────────────
  aCarregar: boolean = false;
  mensagem: string = '';
  erro: string = '';

  // ───────────────────────────────────────────────────────────────────────────
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
    // Carrega o piloto autenticado do localStorage
    this.piloto = this.authService.getPiloto();

    // Formulário para criar uma nova peça no catálogo
    this.novaPecaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      categoria: ['', Validators.required],
      part_number: ['', Validators.required],
      universal: [false], // Se true, a peça aparece para todas as motas
      id_mota: [''], // Mota específica (só usado se universal = false)
    });

    // Formulário para adicionar uma peça ao stock pessoal
    this.novoStockForm = this.fb.group({
      id_peca: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      notas: [''],
    });
  }

  // ─── Inicialização ─────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.carregarMotasPiloto();
    this.carregarPecas();
    this.carregarStock();
    this.carregarPedidos();
    this.carregarHistorico();
    this.carregarPilotos();
  }

  // Limpa mensagens ao mudar de tab
  mudarTab(tab: string): void {
    this.tabAtiva = tab;
    this.mensagem = '';
    this.erro = '';
  }

  // ─── PEÇAS ─────────────────────────────────────────────────────────────────

  // Carrega peças compatíveis com a mota do piloto + peças universais
  carregarPecas(): void {
    if (!this.piloto?.id_mota) {
      this.pecas = [];
      this.pecasFiltradas = [];
      return;
    }

    const filtros: any = {};
    if (this.categoriaFiltro) filtros.categoria = this.categoriaFiltro;

    this.pecasService.getPecas(filtros).subscribe({
      next: (todasPecas) => {
        // Buscar as compatibilidades da mota do piloto na tabela peca_mota
        this.http
          .get<any[]>(`${environment.apiUrl}/peca-mota/mota/${this.piloto.id_mota}`)
          .subscribe({
            next: (compatibilidades) => {
              const idsPecasCompativeis = compatibilidades.map((c: any) => c.id_peca);
              // Mostrar peças compatíveis com a mota OU marcadas como universais
              this.pecas = todasPecas.filter(
                (p) => idsPecasCompativeis.includes(p.id) || p.universal === true,
              );
              this.aplicarFiltroPesquisa();
            },
            error: () => {
              // Se não houver compatibilidades, mostra só as universais
              this.pecas = todasPecas.filter((p) => p.universal === true);
              this.aplicarFiltroPesquisa();
            },
          });
      },
      error: () => (this.erro = 'Erro ao carregar peças'),
    });
  }

  // Filtra o array de peças localmente por part number ou nome — sem ir ao backend
  aplicarFiltroPesquisa(): void {
    if (!this.partNumberFiltro) {
      this.pecasFiltradas = [...this.pecas];
      return;
    }
    const termo = this.partNumberFiltro.toLowerCase();
    this.pecasFiltradas = this.pecas.filter(
      (p) => p.part_number?.toLowerCase().includes(termo) || p.nome?.toLowerCase().includes(termo),
    );
  }

  // Atualiza o filtro de pesquisa em tempo real enquanto o piloto escreve
  filtrarPartNumber(valor: string): void {
    this.partNumberFiltro = valor;
    this.aplicarFiltroPesquisa();
  }

  // Ativa ou desativa o filtro por categoria — clique duplo remove o filtro
  filtrarCategoria(categoria: string): void {
    this.categoriaFiltro = this.categoriaFiltro === categoria ? '' : categoria;
    this.carregarPecas();
  }

  // Cria uma nova peça e associa-a à mota se não for universal
  criarPeca(): void {
    if (this.novaPecaForm.invalid) return;

    const { nome, descricao, categoria, part_number, universal, id_mota } = this.novaPecaForm.value;

    this.pecasService.createPeca({ nome, descricao, categoria, part_number }).subscribe({
      next: (pecaCriada) => {
        if (!universal && id_mota) {
          // Associa a peça à mota na tabela peca_mota
          this.http
            .post(`${environment.apiUrl}/peca-mota`, { id_peca: pecaCriada.id, id_mota })
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
          // Peça universal — não precisa de associação
          this.mensagem = 'Peça universal criada com sucesso!';
          this.mostrarFormPeca = false;
          this.novaPecaForm.reset();
          this.carregarPecas();
        }
      },
      error: (err) => (this.erro = err.error?.error ?? 'Erro ao criar peça'),
    });
  }

  // ─── PEDIDOS DE EMPRÉSTIMO ─────────────────────────────────────────────────

  // Abre o modal de pedido e carrega quem tem a peça disponível no paddock
  pedirEmprestimo(peca: any): void {
    this.pecaSelecionada = peca;
    this.stockDisponivelPeca = [];
    this.erro = '';

    this.stockService.getStock({ id_peca: peca.id }).subscribe({
      next: (items) => {
        // Exclui o próprio piloto e itens indisponíveis
        const disponiveis = items.filter(
          (i: any) => i.id_proprietario !== this.piloto.id && i.disponivel && i.quantidade > 0,
        );

        // Enriquece cada item com o nome e telemóvel do proprietário
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

  // Confirma o pedido de empréstimo com a quantidade escolhida
  confirmarPedido(item: any, quantidade: number): void {
    if (!this.piloto) return;

    if (quantidade < 1 || quantidade > item.quantidade) {
      this.erro = `Quantidade inválida. Máximo disponível: ${item.quantidade}`;
      return;
    }

    this.pedidosService
      .criarPedido({ id_item_stock: item.id, id_piloto: this.piloto.id, quantidade })
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

  // ─── STOCK ─────────────────────────────────────────────────────────────────

  // Carrega a mota do piloto para mostrar no header e filtrar peças
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

  // Carrega apenas o stock do piloto autenticado
  carregarStock(): void {
    if (!this.piloto) return;
    this.stockService.getStock({ id_proprietario: this.piloto.id }).subscribe({
      next: (data) => (this.stock = data),
      error: () => (this.erro = 'Erro ao carregar stock'),
    });
  }

  // Adiciona uma peça ao stock pessoal do piloto
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

  // Alterna a disponibilidade de um item — impede marcar disponível com quantidade 0
  toggleDisponivel(item: any): void {
    if (!item.disponivel && item.quantidade === 0) {
      this.erro = 'Não é possível marcar como disponível com quantidade 0.';
      return;
    }
    this.stockService.updateItemStock(item.id, { disponivel: !item.disponivel }).subscribe({
      next: () => this.carregarStock(),
      error: () => (this.erro = 'Erro ao atualizar item'),
    });
  }

  // Remove um item do stock do piloto
  removerStock(id: string): void {
    this.stockService.deleteItemStock(id).subscribe({
      next: () => {
        this.mensagem = 'Item removido do stock!';
        this.carregarStock();
      },
      error: () => (this.erro = 'Erro ao remover item'),
    });
  }

  // ─── PEDIDOS PENDENTES ─────────────────────────────────────────────────────

  // Carrega os pedidos onde o piloto é o proprietário do item (painel de aprovação)
  carregarPedidos(): void {
    if (!this.piloto) return;
    this.http
      .get<any[]>(`${environment.apiUrl}/pedidos?id_proprietario=${this.piloto.id}`)
      .subscribe({
        next: (pedidos) => {
          this.pedidosPendentes = pedidos;
          // Carrega o stock do proprietário para resolver nomes de peças nos pedidos
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

  // Aprova, recusa ou marca como devolvido um pedido — atualiza tudo depois
  responderPedido(id: string, status: string): void {
    this.pedidosService.responderPedido(id, status).subscribe({
      next: () => {
        this.mensagem = `Pedido ${status.toLowerCase()} com sucesso!`;
        this.carregarPedidos();
        this.carregarStock();
        this.carregarHistorico();
      },
      error: () => (this.erro = 'Erro ao responder ao pedido'),
    });
  }

  // ─── HISTÓRICO ─────────────────────────────────────────────────────────────

  // Carrega o histórico completo — pedidos feitos e recebidos — ordenado por data
  carregarHistorico(): void {
    if (!this.piloto) return;
    this.pedidosService.getHistorico(this.piloto.id).subscribe({
      next: async (data: any) => {
        // Para pedidos feitos, busca o item de stock do proprietário para resolver o nome da peça
        const feitos = await Promise.all(
          data.feitos.map(async (p: any) => {
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

        // Junta e ordena do mais recente para o mais antigo
        this.historico = [...feitos, ...recebidos].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      },
      error: () => (this.erro = 'Erro ao carregar histórico'),
    });
  }

  // ─── HELPERS ───────────────────────────────────────────────────────────────

  // Resolve o nome e part number de uma peça a partir do id_item_stock
  getPecaDoItem(id_item_stock: string): string {
    const item = this.todoPStock.find((s) => s.id === id_item_stock);
    if (!item) return 'Peça desconhecida';
    const peca = this.pecas.find((p) => p.id === item.id_peca);
    return peca ? `${peca.nome} (${peca.part_number})` : 'Peça desconhecida';
  }

  // Resolve o nome do proprietário de um item de stock
  getNomePilotoDoItem(id_item_stock: string): string {
    const item = this.todoPStock.find((s) => s.id === id_item_stock);
    if (!item) return 'piloto desconhecido';
    return this.getNomePiloto(item.id_proprietario);
  }

  // Resolve o nome de um piloto a partir do seu id
  getNomePiloto(id: string): string {
    const piloto = this.pilotos.find((p) => p.id === id);
    return piloto ? `#${piloto.nr_piloto} ${piloto.nome}` : id;
  }

  // Resolve o nome de uma peça a partir do seu id
  getNomePeca(id_peca: string): string {
    const peca = this.pecas.find((p) => p.id === id_peca);
    return peca ? peca.nome : id_peca;
  }

  // ─── AÇÕES GLOBAIS ─────────────────────────────────────────────────────────

  // Abre o PDF do catálogo de peças da mota do piloto numa nova tab
  downloadCatalogo(): void {
    if (this.motaPiloto?.url_documento) {
      window.open(this.motaPiloto.url_documento, '_blank');
    }
  }

  // Carrega todos os pilotos para resolver nomes em pedidos e histórico
  carregarPilotos(): void {
    this.http.get<any[]>(`${environment.apiUrl}/pilotos`).subscribe({
      next: (data) => (this.pilotos = data),
      error: () => {},
    });
  }

  // Termina a sessão e redireciona para o login
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
