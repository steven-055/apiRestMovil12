import { Router } from 'express';
import { getRoles, createRol, updateRol, deleteRol } from '../controllers/rol.controller.js';

const router = Router();



router.post('/rol/crea', createRol);

router.post('/rol/actualiza/:idrol', updateRol);

router.delete('/rol/elimina/:idrol', deleteRol);

export default router;
