import { Request, Response } from 'express';

interface PecaMota {
  id_peca: string;
  id_mota: string;
}

let pecaMota: PecaMota[] = [
  { id_peca: '1', id_mota: '1' }, // Filtro de Ar → KTM 450 Rally
  { id_peca: '1', id_mota: '3' }, // Filtro de Ar → Honda CRF450
  { id_peca: '2', id_mota: '1' }, // Amortecedor → KTM 450 Rally
  { id_peca: '3', id_mota: '2' }, // Cabo Embraiagem → Yamaha WR450F
];

// Listar todas as compatibilidades
export const getPecaMota = (req: Request, res: Response): void => {
  res.status(200).json(pecaMota);
};

// Listar todas as peças compatíveis com uma mota específica
export const getPecasByMota = (req: Request, res: Response): void => {
  const { id_mota } = req.params;
  const resultado = pecaMota.filter(pm => pm.id_mota === id_mota);

  if (resultado.length === 0) {
    res.status(404).json({ error: 'Nenhuma peça encontrada para esta mota' });
    return;
  }

  res.status(200).json(resultado);
};

// Listar todas as motas compatíveis com uma peça
export const getMotasByPeca = (req: Request, res: Response): void => {
  const { id_peca } = req.params;
  const resultado = pecaMota.filter(pm => pm.id_peca === id_peca);

  if (resultado.length === 0) {
    res.status(404).json({ error: 'Nenhuma mota encontrada para esta peça' });
    return;
  }

  res.status(200).json(resultado);
};

// Adicionar compatibilidade entre peça e mota
export const createPecaMota = (req: Request, res: Response): void => {
  const { id_peca, id_mota } = req.body;

  if (!id_peca || !id_mota) {
    res.status(400).json({ error: 'id_peca e id_mota são obrigatórios' });
    return;
  }

  // Verificar se já existe, para não criar duplicados
  const jaExiste = pecaMota.find(pm => pm.id_peca === id_peca && pm.id_mota === id_mota);
  if (jaExiste) {
    res.status(409).json({ error: 'Esta compatibilidade já existe' });
    return;
  }

  const nova: PecaMota = { id_peca, id_mota };
  pecaMota.push(nova);
  res.status(201).json(nova);
};

// Remover compatibilidade
export const deletePecaMota = (req: Request, res: Response): void => {
  const { id_peca, id_mota } = req.body;

  const idx = pecaMota.findIndex(pm => pm.id_peca === id_peca && pm.id_mota === id_mota);

  if (idx === -1) {
    res.status(404).json({ error: 'Compatibilidade não encontrada' });
    return;
  }

  pecaMota.splice(idx, 1);
  res.status(200).json({ message: 'Compatibilidade removida com sucesso' });
};