import { Request, Response } from 'express';

interface Peca {
  id: string;
  nome: string;
  descricao: string;
  id_mota: string;
  categoria: string;
  disponivel: boolean;
  id_proprietario: string;
}

let pecas: Peca[] = [
  { id: '1', nome: 'Filtro de Ar', descricao: 'Filtro original KTM', id_mota: '1', categoria: 'Motor', disponivel: true, id_proprietario: 'user1' },
  { id: '2', nome: 'Amortecedor Traseiro', descricao: 'WP XPLOR usado 1 rally', id_mota: '1', categoria: 'Suspensão', disponivel: true, id_proprietario: 'user2' },
  { id: '3', nome: 'Cabo de Embraiagem', descricao: 'Cabo novo em embalagem', id_mota: '2', categoria: 'Transmissão', disponivel: false, id_proprietario: 'user1' },
];

export const getPecas = (req: Request, res: Response): void => {
  const { mota, categoria } = req.query;
  let resultado = [...pecas];

  if (mota) resultado = resultado.filter(p => p.id_mota === mota);
  if (categoria) resultado = resultado.filter(p => p.categoria.toLowerCase() === String(categoria).toLowerCase());

  res.status(200).json(resultado);
};

export const getPeca = (req: Request, res: Response): void => {
  const peca = pecas.find(p => p.id === req.params.id);

  if (!peca) {
    res.status(404).json({ error: 'Peça não encontrada' });
    return;
  }

  res.status(200).json(peca);
};

export const createPeca = (req: Request, res: Response): void => {
  const { nome, descricao, id_mota, categoria, disponivel, id_proprietario } = req.body;

  if (!nome || !id_mota || !categoria) {
    res.status(400).json({ error: 'Nome, id_mota e categoria são obrigatórios' });
    return;
  }

  const nova: Peca = {
    id: String(pecas.length + 1),
    nome,
    descricao,
    id_mota,
    categoria,
    disponivel: disponivel ?? true,
    id_proprietario
  };

  pecas.push(nova);
  res.status(201).json(nova);
};

export const updatePeca = (req: Request, res: Response): void => {
  const idx = pecas.findIndex(p => p.id === req.params.id);

  if (idx === -1) {
    res.status(404).json({ error: 'Peça não encontrada' });
    return;
  }

  pecas[idx] = { ...pecas[idx], ...req.body };
  res.status(200).json(pecas[idx]);
};

export const deletePeca = (req: Request, res: Response): void => {
  const idx = pecas.findIndex(p => p.id === req.params.id);

  if (idx === -1) {
    res.status(404).json({ error: 'Peça não encontrada' });
    return;
  }

  pecas.splice(idx, 1);
  res.status(200).json({ message: 'Peça eliminada com sucesso' });
};