import { Router } from 'express';
import { getEquipas, getEquipa, createEquipa } from '../controllers/equipas.controller';

const router = Router();

router.get('/', getEquipas);
router.get('/:id', getEquipa);
router.post('/', createEquipa);

export default router;