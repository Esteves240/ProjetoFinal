# ProjetoFinal

##Paddock Share – A rede de solidariedade mecânica do Dakar

No Rali Dakar, a diferença entre terminar a etapa ou abandonar a prova pode resumir-se a um simples parafuso. Para as equipas mais amadoras, o maior desafio não é apenas a pista, mas a gestão de recursos limitados. 
O Paddock Share nasce para garantir que ninguém fica pelo caminho por falta de stock. Através de uma plataforma intuitiva que consulta vistas explodidas (exploded-view drawings), as equipas podem identificar peças com precisão cirúrgica e solicitar empréstimos a outros participantes com modelos de mota idênticos.
É a tecnologia ao serviço da alma da corrida: o companheirismo.

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Angular 21+ com TypeScript |
| Backend | Node.js 24+ com Express |
| Base de Dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth (JWT) |
| Deploy Frontend | Vercel |
| Deploy Backend | Render.com |
| CI/CD | GitHub Actions |

## Arquitetura da Base de Dados
```
Equipa         → id, nome, pais
Piloto         → id, nome, nr_piloto, id_equipa, email, telemovel, id_mota
Mota           → id, marca, modelo, ano
Peca           → id, nome, descricao, categoria
Peca_Mota      → id_peca, id_mota
Item_Stock     → id, id_peca, id_proprietario, quantidade, disponivel, notas
Pedido         → id, id_item_stock, id_piloto, status, timestamp
```

## Endpoints da API

### Motas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/motas` | Listar todas as motas |
| GET | `/api/motas/:id` | Detalhe de uma mota |
| POST | `/api/motas` | Criar mota |

### Equipas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/equipas` | Listar todas as equipas |
| GET | `/api/equipas/:id` | Detalhe de uma equipa |
| POST | `/api/equipas` | Criar equipa |

### Pilotos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pilotos` | Listar todos os pilotos |
| GET | `/api/pilotos/:id` | Detalhe de um piloto |
| POST | `/api/pilotos` | Criar piloto |
| PUT | `/api/pilotos/:id` | Atualizar piloto |
| DELETE | `/api/pilotos/:id` | Eliminar piloto |

### Peças
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pecas` | Listar peças |
| GET | `/api/pecas/:id` | Detalhe de uma peça |
| POST | `/api/pecas` | Criar peça |
| PUT | `/api/pecas/:id` | Atualizar peça |
| DELETE | `/api/pecas/:id` | Eliminar peça |

### Compatibilidade Peça-Mota
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/peca-mota` | Listar compatibilidades |
| GET | `/api/peca-mota/mota/:id_mota` | Peças compatíveis com uma mota |
| GET | `/api/peca-mota/peca/:id_peca` | Motas compatíveis com uma peça |
| POST | `/api/peca-mota` | Adicionar compatibilidade |
| DELETE | `/api/peca-mota` | Remover compatibilidade |

### Stock
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/stock` | Listar stock (filtros: id_peca, id_proprietario) |
| GET | `/api/stock/:id` | Detalhe de um item |
| POST | `/api/stock` | Adicionar item ao stock |
| PUT | `/api/stock/:id` | Atualizar item (quantidade 0 → indisponível) |
| DELETE | `/api/stock/:id` | Remover item |

### Pedidos de Empréstimo
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pedidos` | Listar pedidos |
| GET | `/api/pedidos/:id` | Detalhe de um pedido |
| GET | `/api/pedidos/historico/:id_piloto` | Histórico de um piloto |
| POST | `/api/pedidos` | Criar pedido de empréstimo |
| PUT | `/api/pedidos/:id` | Aprovar / Recusar / Devolvido |

## Como Correr Localmente
```bash
# Clonar o repositório
git clone https://github.com/Esteves240/ProjetoFinal.git
cd ProjetoFinal/backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Correr em desenvolvimento
npm run dev
```

O servidor fica disponível em `http://localhost:3000`

## Variáveis de Ambiente
```bash
# .env.example
PORT=3000
SUPABASE_URL
SUPABASE_KEY
```

## Funcionalidades Implementadas

- CRUD completo de Peças, Pilotos, Equipas e Motas
- Sistema de compatibilidade Peça ↔ Mota
- Gestão de stock com quantidade por piloto
- Fluxo de empréstimo com estados: Pendente → Aprovado / Recusado → Devolvido
- Histórico de pedidos por piloto
- Quando quantidade chega a 0, item fica automaticamente indisponível

## Decisão de Design

**Separação entre `Peca` e `Item_Stock`**

Uma `Peca` representa a definição técnica (nome, categoria). Um `Item_Stock` representa a unidade física que um piloto tem no paddock. Esta separação permite que vários pilotos tenham a mesma peça disponível, com quantidades independentes, evitando duplicação de dados.

## URL de Produção
https://paddockshare-backend.onrender.com
