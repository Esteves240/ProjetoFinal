import { Request, Response } from 'express';
import { supabase } from '../supabase';

// interface PecaMota {
//   id_peca: string;
//   id_mota: string;
// }
// 
// let pecaMota: PecaMota[] = [
//   { id_peca: '1', id_mota: '1' }, // Filtro de Ar → KTM 450 Rally
//   { id_peca: '1', id_mota: '3' }, // Filtro de Ar → Honda CRF450
//   { id_peca: '2', id_mota: '1' }, // Amortecedor → KTM 450 Rally
//   { id_peca: '3', id_mota: '2' }, // Cabo Embraiagem → Yamaha WR450F
// ];

// Listar todas as compatibilidades
export const getPecaMota = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('peca_mota')
    .select('*');

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
};

// Listar todas as peças compatíveis com uma mota específica
export const getPecasByMota = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('peca_mota')
    .select('*')
    .eq('id_mota', req.params.id_mota);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
};

// Listar todas as motas compatíveis com uma peça
export const getMotasByPeca = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('peca_mota')
    .select('*')
    .eq('id_peca', req.params.id_peca);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
};


// Adicionar compatibilidade entre peça e mota
export const createPecaMota = async (req: Request, res: Response): Promise<void> => {
  const { id_peca, id_mota } = req.body;

  if (!id_peca || !id_mota) {
    res.status(400).json({ error: 'id_peca e id_mota são obrigatórios' });
    return;
  }

  const { data, error } = await supabase
    .from('peca_mota')
    .insert({ id_peca, id_mota })
    .select()
    .single();

  if (error) {
    // Erro 23505 é o código PostgreSQL para chave duplicada
    if (error.code === '23505') {
      res.status(409).json({ error: 'Esta compatibilidade já existe' });
      return;
    }
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
};

// Remover compatibilidade
export const deletePecaMota = async (req: Request, res: Response): Promise<void> => {
  const { id_peca, id_mota } = req.body;

  if (!id_peca || !id_mota) {
    res.status(400).json({ error: 'id_peca e id_mota são obrigatórios' });
    return;
  }

  const { error } = await supabase
    .from('peca_mota')
    .delete()
    .eq('id_peca', id_peca)
    .eq('id_mota', id_mota);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ message: 'Compatibilidade removida com sucesso' });
};