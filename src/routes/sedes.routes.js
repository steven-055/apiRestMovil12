import { Router } from 'express';
import { getSedes, createSede, updateSede, deleteSede } from '../controllers/sedes.controller.js'

const router = Router()

router.get('/sedes/lista', getSedes);


router.post('/sedes/crea', createSede);

router.patch('/sedes/actualiza/:id_Ubi', updateSede); 

router.delete('/sedes/elimina/:id_Ubi', deleteSede); 


export default router




