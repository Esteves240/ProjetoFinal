import { Request, Response } from 'express';

interface Equipa {
  id: string;
  nome: string;
  pais: string;
  email: string;
}

let equipas: Equipa[] = [
  { id: '1', nome: 'KTM Rally Team', pais: 'Austria', email: 'exemple@ktm.com' },
  { id: '2', nome: 'Yamaha Supported Team', pais: 'Japan', email: 'exemple@yamaha.com' },
  { id: '3', nome: 'HRC Honda', pais: 'Japan', email: 'exemple@honda.com' },
];

export const getEquipas = (req: Request, res: Response): void => {
  res.status(200).json(equipas);
};

export const getEquipa = (req: Request, res: Response): void => {
  const equipa = equipas.find(e => e.id === req.params.id);

  if (!equipa) {
    res.status(404).json({ error: 'Equipa não encontrada' });
    return;
  }

  res.status(200).json(equipa);
};

export const createEquipa = (req: Request, res: Response): void => {
  const { nome, pais, email } = req.body;

  if (!nome || !pais || !email) {
    res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    return;
  }

  const nova: Equipa = {
    id: String(equipas.length + 1),
    nome,
    pais,
    email,
  };

  equipas.push(nova);
  res.status(201).json(nova);
};