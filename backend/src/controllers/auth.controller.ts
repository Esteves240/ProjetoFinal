import { Request, Response } from 'express';
import { supabase } from '../supabase';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, nome, nr_piloto, id_equipa, telemovel, id_mota } = req.body;

  
  if (!email || !password || !nome || !nr_piloto) {
    res.status(400).json({ error: 'Email, password, nome e nr_piloto são obrigatórios' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'A password deve ter pelo menos 6 caracteres' });
    return;
  }

  // 1. Criar utilizador no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError || !authData.user) {
    res.status(400).json({ error: authError?.message ?? 'Erro ao criar utilizador' });
    return;
  }

  // 2. Criar o piloto na nossa tabela ligado ao auth user
  const { data: piloto, error: pilotoError } = await supabase
    .from('piloto')
    .insert({
      id: authData.user.id,  // usar o mesmo ID do Supabase Auth na tabela piloto. Assim as duas tabelas estão sempre sincronizadas e é fácil saber qual o piloto autenticado
      nome,
      nr_piloto,
      id_equipa: id_equipa ?? null,
      email,
      telemovel: telemovel ?? null,
      id_mota: id_mota ?? null
    })
    .select()
    .single();

  if (pilotoError) {
    res.status(500).json({ error: pilotoError.message });
    return;
  }

  res.status(201).json({
    message: 'Piloto registado com sucesso',
    piloto,
    token: authData.session?.access_token ?? null
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email e password são obrigatórios' });
    return;
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.user) {
    res.status(401).json({ error: 'Credenciais inválidas' });
    return;
  }

  // Buscar os dados do piloto
  const { data: piloto, error: pilotoError } = await supabase
    .from('piloto')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (pilotoError) {
    res.status(500).json({ error: pilotoError.message });
    return;
  }

  res.status(200).json({
    message: 'Login bem-sucedido',
    piloto,
    token: data.session.access_token
  });
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ message: 'Logout efetuado com sucesso' });
};