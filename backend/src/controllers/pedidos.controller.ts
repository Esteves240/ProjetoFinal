//Pedido_emprestimo
import { Request, Response } from 'express';
import { supabase } from '../supabase';

// type Status = 'Pendente' | 'Aprovado' | 'Recusado' | 'Devolvido';
// 
// interface Pedido {
//   id: string;
//   id_item_stock: string;
//   id_piloto: string; //Piloto que requere
//   status: Status;
//   timestamp: string;
// }
// 
// let pedidos: Pedido[] = [
//     { id: '1', id_item_stock: '2', id_piloto: '1', status: 'Pendente', timestamp: new Date().toISOString() },
//     { id: '2', id_item_stock: '2', id_piloto: '2', status: 'Pendente', timestamp: new Date().toISOString() },
//     { id: '3', id_item_stock: '2', id_piloto: '1', status: 'Pendente', timestamp: new Date().toISOString() },
// ];


const STATUS_VALIDOS = ['Aprovado', 'Recusado', 'Devolvido'];

// Listar pedidos — filtro por piloto (painel do piloto)
export const getPedidos = async (req: Request, res: Response): Promise<void> => {
  const { id_piloto, id_proprietario } = req.query;

  let query = supabase.from('pedido_emprestimo').select('*');

  if (id_piloto) query = query.eq('id_piloto', id_piloto);

  // Filtra pedidos onde o proprietário do item é este piloto
  if (id_proprietario) {
    const { data: itemsDoProprietario } = await supabase
      .from('item_stock')
      .select('id')
      .eq('id_proprietario', id_proprietario);

    const ids = (itemsDoProprietario ?? []).map((i: any) => i.id);

    if (ids.length === 0) {
      res.status(200).json([]);
      return;
    }

    query = query.in('id_item_stock', ids).eq('status', 'Pendente');
  }

  const { data, error } = await query;

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
};


// Ver um pedido específico
export const getPedido = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabase
    .from('pedido_emprestimo')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    res.status(404).json({ error: 'Pedido não encontrado' });
    return;
  }

  res.status(200).json(data);
};

// Piloto faz um pedido de empréstimo
export const criarPedido = async (req: Request, res: Response): Promise<void> => {
  const { id_item_stock, id_piloto } = req.body;

  if (!id_item_stock || !id_piloto) {
    res.status(400).json({ error: 'id_item_stock e id_piloto são obrigatórios' });
    return;
  }

  // Verificar se o item existe e está disponível
  const { data: item, error: itemError } = await supabase
    .from('item_stock')
    .select('*')
    .eq('id', id_item_stock)
    .single();

  if (itemError || !item) {
    res.status(404).json({ error: 'Item não encontrado' });
    return;
  }

  if (!item.disponivel || item.quantidade <= 0) {
    res.status(400).json({ error: 'Este item não está disponível para empréstimo' });
    return;
  }

  const { data, error } = await supabase
    .from('pedido_emprestimo')
    .insert({ id_item_stock, id_piloto, status: 'Pendente' })
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(201).json(data);
};

// Proprietário aprova, recusa ou marca como devolvido
export const responderPedido = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body;

  if (!STATUS_VALIDOS.includes(status)) {
    res.status(400).json({ error: 'Status inválido. Use: Aprovado, Recusado ou Devolvido' });
    return;
  }

  // Buscar o pedido para saber qual o item
  const { data: pedido, error: pedidoError } = await supabase
    .from('pedido_emprestimo')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (pedidoError || !pedido) {
    res.status(404).json({ error: 'Pedido não encontrado' });
    return;
  }

  // Se aprovado, baixa a quantidade do stock
  if (status === 'Aprovado') {
    const { data: item } = await supabase
      .from('item_stock')
      .select('quantidade')
      .eq('id', pedido.id_item_stock)
      .single();

    if (item) {
      const novaQuantidade = item.quantidade - 1;
      await supabase
        .from('item_stock')
        .update({
          quantidade: novaQuantidade,
          disponivel: novaQuantidade > 0
        })
        .eq('id', pedido.id_item_stock);
    }
  }

  // Se devolvido, sobe a quantidade do stock
  if (status === 'Devolvido') {
    const { data: item } = await supabase
      .from('item_stock')
      .select('quantidade')
      .eq('id', pedido.id_item_stock)
      .single();

    if (item) {
      await supabase
        .from('item_stock')
        .update({
          quantidade: item.quantidade + 1,
          disponivel: true
        })
        .eq('id', pedido.id_item_stock);
    }
  }

  // Atualizar o status do pedido
  const { data, error } = await supabase
    .from('pedido_emprestimo')
    .update({ status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
};


// Histórico completo de um piloto (pedidos feitos e recebidos)
export const getHistorico = async (req: Request, res: Response): Promise<void> => {
  const { id_piloto } = req.params;

  const { data, error } = await supabase
    .from('pedido_emprestimo')
    .select('*')
    .eq('id_piloto', id_piloto);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json(data);
};