import { Router } from 'express';
import { getMotas, getMota, createMota } from '../controllers/motas.controller';

const router = Router();

router.get('/', getMotas);
router.get('/:id', getMota);
router.post('/', createMota);

export default router;