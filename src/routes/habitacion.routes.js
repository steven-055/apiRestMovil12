import { Router } from 'express';
import { getHabitaciones,getAllHabitaciones, createHabitacion, updateHabitacion, deleteHabitacion } from '../controllers/habitacion.controller.js';

const router = Router();

router.get('/habitacion/lista/:id_Ubi', getHabitaciones);

router.get('/habitacion/lista', getAllHabitaciones);

router.post('/habitacion/crea', createHabitacion);

router.patch('/habitacion/actualiza/:id_Habi', updateHabitacion);

router.delete('/habitacion/elimina/:id_Habi', deleteHabitacion);

export default router;
