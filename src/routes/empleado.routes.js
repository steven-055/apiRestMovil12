import { Router } from 'express';
import { getEmpleados, createEmpleados, updateEmpleados, deleteEmpleados } from '../controllers/empleado.controller.js'

const router = Router()

router.get('/empleado/lista', getEmpleados);

router.post('/empleado/crea', createEmpleados);

router.patch('/empleado/actualiza/:cod_empleado', updateEmpleados); 

router.delete('/empleado/elimina/:cod_empleado', deleteEmpleados); 

export default router

