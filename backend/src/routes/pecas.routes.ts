import { Router } from 'express';
import { getPecas, getPeca, createPeca, updatePeca, deletePeca } from '../controllers/pecas.controller';

const router = Router();

router.get('/', getPecas);
router.get('/:id', getPeca);
router.post('/', createPeca);
router.put('/:id', updatePeca);
router.delete('/:id', deletePeca);

export default router;