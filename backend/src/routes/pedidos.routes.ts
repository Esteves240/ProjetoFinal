//Pedido_emprestimo
import { Router } from 'express';
import { getPedidos, getPedido, criarPedido, responderPedido, getHistorico } from '../controllers/pedidos.controller';

const router = Router();

router.get('/', getPedidos);
router.get('/historico/:id_piloto', getHistorico);
router.get('/:id', getPedido);
router.post('/', criarPedido);
router.put('/:id', responderPedido);

export default router;