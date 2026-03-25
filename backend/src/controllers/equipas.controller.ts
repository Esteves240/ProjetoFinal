import { Request, Response } from 'express';
import { supabase } from '../supabase';

// interface Equipa {
//   id: string;
//   nome: string;
//   pais: string;
//   email: string;
// }
// 
// let equipas: Equipa[] = [
//   { id: '1', nome: 'KTM Rally Team', pais: 'Austria', email: 'exemple@ktm.com' },
//   { id: '2', nome: 'Yamaha Supported Team', pais: 'Japan', email: 'exemple@yamaha.com' },
//   { id: '3', nome: 'HRC Honda', pais: 'Japan', email: 'exemple@honda.com' },
// ];


export const getEquipas = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('equipa')
    .select('*');

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
};


export const getEquipa = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('equipa')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    res.status(404).json({ error: 'Equipa não encontrada' });
    return;
  }

  res.status(200).json(data);
};


export const createEquipa = async (req: Request, res: Response): Promise<void> => {
  const { nome, pais, email } = req.body;

  if (!nome || !pais || !email) {
    res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    return;
  }

  const { data, error } = await supabase
    .from('equipa')
    .insert({ nome, pais, email })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
};