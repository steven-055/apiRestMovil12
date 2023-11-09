import { Router } from 'express';
import { getSedes} from '../controllers/sedes.controller.js'

const router = Router()

router.get('/sedes/lista', getSedes);



export default router




