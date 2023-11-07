import { Router } from 'express';
import { getClientes, createClientes, updateClientes, deleteClientes ,loginClientes} from '../controllers/clientes.controller.js'

const router = Router()

router.get('/clientes/lista', getClientes);

router.post('/clientes/crea', createClientes);

router.patch('/clientes/actualiza/:cod_cliente', updateClientes); 


router.delete('/clientes/elimina/:cod_cliente', deleteClientes); 

router.post('/clientes/login', loginClientes); 

export default router

