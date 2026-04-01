# PaddockShare

Nos desportos motorizados, a diferença entre terminar a etapa ou abandonar a prova pode resumir-se a um simples parafuso. Para as equipas mais amadoras, o maior desafio não é apenas a pista, mas a gestão de recursos limitados. 
O Paddock Share nasce para garantir que ninguém fica pelo caminho por falta de stock. Através de uma plataforma intuitiva permitindo que pilotos identifiquem peças pelo catálogo oficial da sua mota, consultem quem tem a peça disponível no paddock, e façam pedidos de empréstimo em tempo real — promovendo o companheirismo e a eficiência técnica entre pilotos e equipas.

---

## ODS Associado

**ODS 17 — Parcerias para a Implementação dos Objetivos**

O PaddockShare transforma a competição individual numa comunidade de entreajuda técnica. Em vez de uma equipa desistir por falta de um filtro de ar ou um cabo de embraiagem, pode encontrar e pedir esse componente a outra equipa do paddock em segundos. A plataforma promove a colaboração, reduz o desperdício de recursos e fortalece os laços entre equipas amadoras.

---

## Screenshot

Já meto, juro!

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Angular v21.2.5 com TypeScript |
| Backend | Node.js v24.14.0 com Express |
| Base de Dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth (JWT) |
| Deploy Frontend | Vercel |
| Deploy Backend | Render.com |
| CI/CD | GitHub Actions |
| Testes | Jest + ts-jest |

---

## URLs de Produção

| Serviço | URL |
|---------|-----|
| Frontend | https://paddockshare.vercel.app |
| Backend API | https://paddockshare-backend.onrender.com |

---

## Como Correr Localmente

### Pré-requisitos
- Node.js 22+
- Conta no Supabase

### 1. Clonar o repositório
```bash
git clone https://github.com/Esteves240/ProjetoFinal.git
cd ProjetoFinal
```

### 2. Configurar o Backend
```bash
cd backend
npm install
cp .env.example .env
# Preenche o .env com as tuas variáveis
npm run dev
```

O servidor fica disponível em `http://localhost:3000`

### 3. Configurar o Frontend
```bash
cd frontend
npm install
ng serve
```

A aplicação fica disponível em `http://localhost:4200`

---

## Variáveis de Ambiente

### Backend — `.env.example`
```
PORT
SUPABASE_URL
SUPABASE_KEY
```

---

## Arquitetura da Base de Dados
```
Equipa              → id, nome, pais, email, created_at
Mota                → id, marca, modelo, ano, url_documento, created_at
Piloto              → id, nome, nr_piloto, id_equipa, email, telemovel, id_mota, created_at
Peca                → id, nome, descricao, categoria, created_at part_number, universal
Peca_Mota           → id_peca, id_mota
Item_Stock          → id, id_peca, id_proprietario, quantidade, disponivel, notas, crated_at
Pedido_Emprestimo   → id, id_item_stock, id_piloto, quantidade, status, created_at
```

---

## Endpoints da API

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registar piloto |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |

### Motas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/motas` | Listar motas |
| GET | `/api/motas/:id` | Detalhe de mota |
| POST | `/api/motas` | Criar mota |

### Equipas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/equipas` | Listar equipas |
| GET | `/api/equipas/:id` | Detalhe de equipa |
| POST | `/api/equipas` | Criar equipa |

### Pilotos
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pilotos` | Listar pilotos |
| GET | `/api/pilotos/:id` | Detalhe de piloto |
| POST | `/api/pilotos` | Criar piloto |
| PUT | `/api/pilotos/:id` | Atualizar piloto |
| DELETE | `/api/pilotos/:id` | Eliminar piloto |

### Peças
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pecas` | Listar peças (filtros: categoria, part_number) |
| GET | `/api/pecas/:id` | Detalhe de peça |
| POST | `/api/pecas` | Criar peça |
| PUT | `/api/pecas/:id` | Atualizar peça |
| DELETE | `/api/pecas/:id` | Eliminar peça |

### Compatibilidade Peça ↔ Mota
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
| GET | `/api/stock/:id` | Detalhe de item |
| POST | `/api/stock` | Adicionar item ao stock |
| PUT | `/api/stock/:id` | Atualizar item |
| DELETE | `/api/stock/:id` | Remover item |

### Pedidos de Empréstimo
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pedidos` | Listar pedidos (filtros: id_piloto, id_proprietario) |
| GET | `/api/pedidos/:id` | Detalhe de pedido |
| GET | `/api/pedidos/historico/:id_piloto` | Histórico completo de um piloto |
| POST | `/api/pedidos` | Criar pedido de empréstimo |
| PUT | `/api/pedidos/:id` | Aprovar / Recusar / Devolvido |

---

## Funcionalidades Implementadas

- Registo e login de pilotos com Supabase Auth (JWT)
- Perfil do piloto — associar mota, equipa e telemóvel
- Catálogo de peças filtrado pela mota do piloto com part number oficial
- Compatibilidade peça ↔ mota — peças universais e específicas
- Gestão de stock com quantidade por piloto
- Motor de busca por categoria e part number
- Fluxo completo de empréstimo — pedido com quantidade, aprovação, recusa e devolução
- Proteção de stock — aprovação automática recusa pedidos pendentes quando stock chega a zero
- Histórico de empréstimos dos dois lados — pedidos feitos e recebidos
- Download do catálogo oficial de peças da mota (exploded view)
- Pipeline CI/CD com GitHub Actions — lint, build e testes automáticos
- 11 testes unitários com Jest

---

## Decisão de Design

**Separação entre `Peca` e `Item_Stock`**

A decisão mais importante foi separar a definição técnica de uma peça da sua existência física no paddock. Uma `Peca` representa o componente técnico — nome, categoria, part number oficial da marca. Um `Item_Stock` representa a unidade física que um piloto tem na sua mala e que pode emprestar, com quantidade e notas de estado.

Esta separação permite que vários pilotos tenham a mesma peça disponível de forma independente, evita duplicação de dados, e torna a pesquisa muito mais eficiente — quando um piloto procura um filtro de ar para a sua KTM 450 Rally, o sistema cruza a tabela `Peca_Mota` com o `Item_Stock` e devolve imediatamente quem tem aquela peça disponível no paddock.

---

## CI/CD

[![CI](https://github.com/Esteves240/ProjetoFinal/actions/workflows/ci.yml/badge.svg)](https://github.com/Esteves240/ProjetoFinal/actions/workflows/ci.yml)
