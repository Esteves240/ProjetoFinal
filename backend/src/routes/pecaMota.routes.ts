import { Router } from 'express';
import { getPecaMota, getPecasByMota, getMotasByPeca, createPecaMota, deletePecaMota } from '../controllers/pecaMota.controller';

const router = Router();

router.get('/', getPecaMota);
router.get('/mota/:id_mota', getPecasByMota);
router.get('/peca/:id_peca', getMotasByPeca);
router.post('/', createPecaMota);
router.delete('/', deletePecaMota);

export default router;