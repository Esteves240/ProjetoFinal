import { Request, Response } from 'express';

interface Piloto {
  id: string;
  nome: string;
  nr_piloto: number;
  id_equipa: string;
  email: string;
  telemovel: string;
  id_mota: string;
}

let pilotos: Piloto[] = [
  { id: '1', nome: 'Jorge Prado', nr_piloto: 26, id_equipa: '1', email: 'jorge@ktm.com', telemovel: '912345678', id_mota: '1' },
  { id: '2', nome: 'Tim Gajer', nr_piloto: 243, id_equipa: '2', email: 'gajer@yamaha.com', telemovel: '923456789', id_mota: '2' },
];

export const getPilotos = (req: Request, res: Response): void => {
  res.status(200).json(pilotos);
};

export const getPiloto = (req: Request, res: Response): void => {
  const piloto = pilotos.find(p => p.id === req.params.id);

  if (!piloto) {
    res.status(404).json({ error: 'Piloto não encontrado' });
    return;
  }

  res.status(200).json(piloto);
};

export const createPiloto = (req: Request, res: Response): void => {
  const { nome, nr_piloto, id_equipa, email, telemovel, id_mota } = req.body;

  if (!nome || !nr_piloto || !email) {
    res.status(400).json({ error: 'Nome, nr de piloto, e email são obrigatórios' });
    return;
  }

  const novo: Piloto = {
    id: String(pilotos.length + 1),
    nome,
    nr_piloto,
    id_equipa,
    email,
    telemovel,
    id_mota
  };

  pilotos.push(novo);
  res.status(201).json(novo);
};

export const updatePiloto = (req: Request, res: Response): void => {
  const idx = pilotos.findIndex(p => p.id === req.params.id);

  if (idx === -1) {
    res.status(404).json({ error: 'Piloto não encontrado' });
    return;
  }

  pilotos[idx] = { ...pilotos[idx], ...req.body };
  res.status(200).json(pilotos[idx]);
};

export const deletePiloto = (req: Request, res: Response): void => {
  const idx = pilotos.findIndex(p => p.id === req.params.id);

  if (idx === -1) {
    res.status(404).json({ error: 'Piloto não encontrado' });
    return;
  }

  pilotos.splice(idx, 1);
  res.status(200).json({ message: 'Piloto eliminado com sucesso' });
};