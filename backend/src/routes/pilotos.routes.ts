import { Router } from 'express';
import { getPilotos, getPiloto, createPiloto, updatePiloto, deletePiloto } from '../controllers/pilotos.controller';

const router = Router();

router.get('/', getPilotos);
router.get('/:id', getPiloto);
router.post('/', createPiloto);
router.put('/:id', updatePiloto);
router.delete('/:id', deletePiloto);

export default router;