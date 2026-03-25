import { Request, Response } from 'express';
import { supabase } from '../supabase';

// Dados temporários
// const motas = [
//   { id: '1', marca: 'KTM', modelo: '450 Rally', ano: 2023 },
//   { id: '2', marca: 'Yamaha', modelo: 'WR450F', ano: 2022 },
//   { id: '3', marca: 'Honda', modelo: 'CRF450 Rally', ano: 2023 },
// ];


export const getMotas = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('mota')
    .select('*');

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
};


export const getMota = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('mota')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    res.status(404).json({ error: 'Mota não encontrada' });
    return;
  }

  res.status(200).json(data);
};


export const createMota = async (req: Request, res: Response): Promise<void> => {
  const { marca, modelo, ano } = req.body;

  if (!marca || !modelo || !ano) {
    res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    return;
  }

  const { data, error } = await supabase
    .from('mota')
    .insert({ marca, modelo, ano })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
};