import { Router } from 'express';
import { getReservas, createReserva, updateReserva, deleteReserva } from '../controllers/reservas.controller.js';

const router = Router();

router.get('/reservas/lista', getReservas);

router.post('/reservas/crea', createReserva);

router.patch('/reservas/actualiza/:id_Reserva', updateReserva);

router.delete('/reservas/elimina/:id_Reserva', deleteReserva);

export default router;
