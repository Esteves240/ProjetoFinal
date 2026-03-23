import { Request, Response } from 'express';

// Dados temporários — mais tarde vêm do Supabase
const motas = [
  { id: '1', marca: 'KTM', modelo: '450 Rally', ano: 2023 },
  { id: '2', marca: 'Yamaha', modelo: 'WR450F', ano: 2022 },
  { id: '3', marca: 'Honda', modelo: 'CRF450 Rally', ano: 2023 },
];

export const getMotas = (req: Request, res: Response): void => {
  res.status(200).json(motas);
};

export const getMota = (req: Request, res: Response): void => {
  const mota = motas.find(m => m.id === req.params.id);

  if (!mota) {
    res.status(404).json({ error: 'Mota não encontrada' });
    return;
  }

  res.status(200).json(mota);
};

export const createMota = (req: Request, res: Response): void => {
  const { marca, modelo, ano } = req.body;

  if (!marca || !modelo || !ano) {
    res.status(400).json({ error: 'Marca, modelo e ano são obrigatórios' });
    return;
  }

  const nova = { id: String(motas.length + 1), marca, modelo, ano };
  motas.push(nova);
  res.status(201).json(nova);
};