import { Router } from 'express';
import { getEmpleados, createEmpleados, updateEmpleados, deleteEmpleados } from '../controllers/empleados.controller.js'

const router = Router()

router.get('/empleados/lista', getEmpleados);

router.post('/empleados/crea', createEmpleados);

router.patch('/empleados/actualiza/:cod_empleado', updateEmpleados); 

router.delete('/empleados/elimina/:cod_empleado', deleteEmpleados); 

export default router

