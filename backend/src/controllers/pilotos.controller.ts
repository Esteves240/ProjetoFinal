import { Request, Response } from 'express';
import { supabase } from '../supabase';

// interface Piloto {
//   id: string;
//   nome: string;
//   nr_piloto: number;
//   id_equipa: string;
//   email: string;
//   telemovel: string;
//   id_mota: string;
// }
// 
// let pilotos: Piloto[] = [
//   { id: '1', nome: 'Jorge Prado', nr_piloto: 26, id_equipa: '1', email: 'jorge@ktm.com', telemovel: '912345678', id_mota: '1' },
//   { id: '2', nome: 'Tim Gajer', nr_piloto: 243, id_equipa: '2', email: 'gajer@yamaha.com', telemovel: '923456789', id_mota: '2' },
// ];


export const getPilotos = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('piloto')
    .select('*');

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
};


export const getPiloto = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('piloto')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    res.status(404).json({ error: 'Piloto não encontrado' });
    return;
  }

  res.status(200).json(data);
};


export const createPiloto = async (req: Request, res: Response): Promise<void> => {
  const { nome, nr_piloto, id_equipa, email, telemovel, id_mota } = req.body;

  if (!nome || !nr_piloto || !id_equipa || !email) {
    res.status(400).json({ error: 'Nome, nr_piloto, id_equipa e email são obrigatórios' });
    return;
  }

  const { data, error } = await supabase
    .from('piloto')
    .insert({ nome, nr_piloto, id_equipa, email, telemovel, id_mota })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
};


export const updatePiloto = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('piloto')
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


export const deletePiloto = async (req: Request, res: Response): Promise<void> => {
  const { error } = await supabase
    .from('piloto')
    .delete()
    .eq('id', req.params.id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ message: 'Piloto eliminado com sucesso' });
};