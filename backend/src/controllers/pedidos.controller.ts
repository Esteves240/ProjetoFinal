//Pedido_emprestimo
import { Request, Response } from 'express';

type Status = 'Pendente' | 'Aprovado' | 'Recusado' | 'Devolvido';

interface Pedido {
  id: string;
  id_item_stock: string;
  id_piloto: string; //Piloto que requere
  status: Status;
  timestamp: string;
}

let pedidos: Pedido[] = [
    { id: '1', id_item_stock: '2', id_piloto: '1', status: 'Pendente', timestamp: new Date().toISOString() },
    { id: '2', id_item_stock: '2', id_piloto: '2', status: 'Pendente', timestamp: new Date().toISOString() },
    { id: '3', id_item_stock: '2', id_piloto: '1', status: 'Pendente', timestamp: new Date().toISOString() },
];

// Listar pedidos — filtro por piloto (painel do piloto)
export const getPedidos = (req: Request, res: Response): void => {
  const { id_piloto } = req.query;
  let resultado = [...pedidos];

  if (id_piloto) resultado = resultado.filter(p => p.id_piloto === id_piloto);

  res.status(200).json(resultado);
};

// Ver um pedido específico
export const getPedido = (req: Request, res: Response): void => {
  const pedido = pedidos.find(p => p.id === req.params.id);

  if (!pedido) {
    res.status(404).json({ error: 'Pedido não encontrado' });
    return;
  }

  res.status(200).json(pedido);
};

// Piloto faz um pedido de empréstimo
export const criarPedido = (req: Request, res: Response): void => {
  const { id_item_stock, id_piloto } = req.body;

  if (!id_item_stock || !id_piloto) {
    res.status(400).json({ error: 'id_item_stock e id_piloto são obrigatórios' });
    return;
  }

  const novo: Pedido = {
    id: String(pedidos.length + 1),
    id_item_stock,
    id_piloto,
    status: 'Pendente',
    timestamp: new Date().toISOString()
  };

  pedidos.push(novo);
  res.status(201).json(novo);
};

// Proprietário aprova, recusa ou marca como devolvido
export const responderPedido = (req: Request, res: Response): void => {
  const idx = pedidos.findIndex(p => p.id === req.params.id);

  if (idx === -1) {
    res.status(404).json({ error: 'Pedido não encontrado' });
    return;
  }

  const { status } = req.body;
  const statusValidos: Status[] = ['Aprovado', 'Recusado', 'Devolvido'];

  if (!statusValidos.includes(status)) {
    res.status(400).json({ error: 'Status inválido. Use: Aprovado, Recusado ou Devolvido' });
    return;
  }

  pedidos[idx].status = status;
  res.status(200).json(pedidos[idx]);
};

// Histórico completo de um piloto (pedidos feitos e recebidos)
export const getHistorico = (req: Request, res: Response): void => {
  const { id_piloto } = req.params;
  const historico = pedidos.filter(p => p.id_piloto === id_piloto);

  res.status(200).json(historico);
};