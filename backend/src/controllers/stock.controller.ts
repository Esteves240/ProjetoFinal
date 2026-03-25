//Item_Stock
import { Request, Response } from 'express';
import { supabase } from '../supabase';

// interface ItemStock {
//   id: string;
//   id_peca: string;
//   id_proprietario: string;
//     quantidade: number;
//   disponivel: boolean;
//   notas: string;
//   //criar um estado e data?
// }
// 
// let stock: ItemStock[] = [
//   { id: '1', id_peca: '1', id_proprietario: '1', quantidade: 2, disponivel: true, notas: 'Filtro usado apenas 1 rally' },
//   { id: '2', id_peca: '1', id_proprietario: '2', quantidade: 1, disponivel: true, notas: 'Filtro novo em caixa' },
//   { id: '3', id_peca: '2', id_proprietario: '1', quantidade: 1, disponivel: false, notas: 'Amortecedor a precisar de revisão' },
// ];

// Listar todo o stock — com filtro opcional por peça ou proprietário
export const getStock = async (req: Request, res: Response): Promise<void> => {
  const { id_peca, id_proprietario } = req.query;

  let query = supabase.from('item_stock').select('*');

  if (id_peca) query = query.eq('id_peca', id_peca);
  if (id_proprietario) query = query.eq('id_proprietario', id_proprietario);

  const { data, error } = await query;

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
};

// Ver um item específico
export const getItemStock = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('item_stock')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    res.status(404).json({ error: 'Item não encontrado' });
    return;
  }

  res.status(200).json(data);
};


// Piloto adiciona uma peça ao seu stock
export const createItemStock = async (req: Request, res: Response): Promise<void> => {
  const { id_peca, id_proprietario, quantidade, disponivel, notas } = req.body;

  if (!id_peca || !id_proprietario) {
    res.status(400).json({ error: 'id_peca e id_proprietario são obrigatórios' });
    return;
  }

  if (quantidade !== undefined && quantidade < 0) {
    res.status(400).json({ error: 'Quantidade não pode ser negativa' });
    return;
  }

  const { data, error } = await supabase
    .from('item_stock')
    .insert({
      id_peca,
      id_proprietario,
      quantidade: quantidade ?? 1,
      disponivel: disponivel ?? true,
      notas: notas ?? ''
    })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
};

// Atualizar disponibilidade ou notas
export const updateItemStock = async (req: Request, res: Response): Promise<void> => {
  const updates = { ...req.body };

  // Se quantidade chegar a 0 fica automaticamente indisponível
  if (updates.quantidade !== undefined && updates.quantidade <= 0) {
    updates.quantidade = 0;
    updates.disponivel = false;
  }

  const { data, error } = await supabase
    .from('item_stock')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
};


// Remover item do stock
export const deleteItemStock = async (req: Request, res: Response): Promise<void> => {
  const { error } = await supabase
    .from('item_stock')
    .delete()
    .eq('id', req.params.id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ message: 'Item removido do stock com sucesso' });
};