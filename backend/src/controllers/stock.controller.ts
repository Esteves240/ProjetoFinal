//Item_Stock
import { Request, Response } from 'express';

interface ItemStock {
  id: string;
  id_peca: string;
  id_proprietario: string;
  disponivel: boolean;
  notas: string;
  //criar um estado e data?
}

let stock: ItemStock[] = [
  { id: '1', id_peca: '1', id_proprietario: '1', disponivel: true, notas: 'Filtro usado apenas 1 rally' },
  { id: '2', id_peca: '1', id_proprietario: '2', disponivel: true, notas: 'Filtro novo em caixa' },
  { id: '3', id_peca: '2', id_proprietario: '1', disponivel: false, notas: 'Amortecedor a precisar de revisão' },
];

// Listar todo o stock — com filtro opcional por peça ou proprietário
export const getStock = (req: Request, res: Response): void => {
  const { id_peca, id_proprietario } = req.query;
  let resultado = [...stock];

  if (id_peca) resultado = resultado.filter(s => s.id_peca === id_peca);
  if (id_proprietario) resultado = resultado.filter(s => s.id_proprietario === id_proprietario);

  res.status(200).json(resultado);
};

// Ver um item específico
export const getItemStock = (req: Request, res: Response): void => {
  const item = stock.find(s => s.id === req.params.id);

  if (!item) {
    res.status(404).json({ error: 'Item não encontrado' });
    return;
  }

  res.status(200).json(item);
};

// Piloto adiciona uma peça ao seu stock
export const createItemStock = (req: Request, res: Response): void => {
  const { id_peca, id_proprietario, disponivel, notas } = req.body;

  if (!id_peca || !id_proprietario) {
    res.status(400).json({ error: 'id_peca e id_proprietario são obrigatórios' });
    return;
  }

  const novo: ItemStock = {
    id: String(stock.length + 1),
    id_peca,
    id_proprietario,
    disponivel: disponivel ?? true,
    notas: notas ?? ''
  };

  stock.push(novo);
  res.status(201).json(novo);
};

// Atualizar disponibilidade ou notas
export const updateItemStock = (req: Request, res: Response): void => {
  const idx = stock.findIndex(s => s.id === req.params.id);

  if (idx === -1) {
    res.status(404).json({ error: 'Item não encontrado' });
    return;
  }

  stock[idx] = { ...stock[idx], ...req.body };
  res.status(200).json(stock[idx]);
};

// Remover item do stock
export const deleteItemStock = (req: Request, res: Response): void => {
  const idx = stock.findIndex(s => s.id === req.params.id);

  if (idx === -1) {
    res.status(404).json({ error: 'Item não encontrado' });
    return;
  }

  stock.splice(idx, 1);
  res.status(200).json({ message: 'Item removido do stock com sucesso' });
};