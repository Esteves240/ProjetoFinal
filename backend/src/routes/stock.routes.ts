//Item_Stock
import { Router } from 'express';
import { getStock, getItemStock, createItemStock, updateItemStock, deleteItemStock } from '../controllers/stock.controller';

const router = Router();

router.get('/', getStock);
router.get('/:id', getItemStock);
router.post('/', createItemStock);
router.put('/:id', updateItemStock);
router.delete('/:id', deleteItemStock);

export default router;