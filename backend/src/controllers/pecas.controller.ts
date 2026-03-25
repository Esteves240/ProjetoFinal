import { Request, Response } from 'express';
import { supabase } from '../supabase';

// interface Peca {
//   id: string;
//   nome: string;
//   descricao: string;
//   categoria: string;
// }
// 
// let pecas: Peca[] = [
//   { id: '1', nome: 'Filtro de Ar', descricao: 'Filtro original KTM', categoria: 'Motor' },
//   { id: '2', nome: 'Amortecedor Traseiro', descricao: 'WP XPLOR usado 1 rally', categoria: 'Suspensão' },
//   { id: '3', nome: 'Cabo de Embraiagem', descricao: 'Cabo novo em embalagem', categoria: 'Transmissão' },
// ];


export const getPecas = async (req: Request, res: Response): Promise<void> => {
  const { categoria } = req.query;

  let query = supabase.from('peca').select('*');

  if (categoria) query = query.eq('categoria', categoria);

  const { data, error } = await query;

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
};


export const getPeca = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('peca')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    res.status(404).json({ error: 'Peça não encontrada' });
    return;
  }

  res.status(200).json(data);
};


const CATEGORIAS_VALIDAS = [
  'Motor',
  'Suspensão',
  'Transmissão',
  'Eletrónica',
  'Travões',
  'Lubrificação',
  'Rodas e Pneus',
  'Ferramentas',
  'Outros'
];

export const createPeca = async (req: Request, res: Response): Promise<void> => {
  const { nome, descricao, categoria } = req.body;

  if (!nome || !categoria) {
    res.status(400).json({ error: 'Nome e categoria são obrigatórios' });
    return;
  }

  if (!CATEGORIAS_VALIDAS.includes(categoria)) {
    res.status(400).json({
      error: `Categoria inválida. Use uma das seguintes: ${CATEGORIAS_VALIDAS.join(', ')}`
    });
    return;
  }

  const { data, error } = await supabase
    .from('peca')
    .insert({ nome, descricao, categoria })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
};


export const updatePeca = async (req: Request, res: Response): Promise<void> => {
  if (req.body.categoria && !CATEGORIAS_VALIDAS.includes(req.body.categoria)) {
    res.status(400).json({
      error: `Categoria inválida. Use uma das seguintes: ${CATEGORIAS_VALIDAS.join(', ')}`
    });
    return;
  }

  const { data, error } = await supabase
    .from('peca')
    .update(req.body)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
};


export const deletePeca = async (req: Request, res: Response): Promise<void> => {
  const { error } = await supabase
    .from('peca')
    .delete()
    .eq('id', req.params.id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ message: 'Peça eliminada com sucesso' });
};