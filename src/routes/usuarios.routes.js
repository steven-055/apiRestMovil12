import { Router } from 'express';
import { getUsuarios, createUsuarios, updateUsuarios, deleteUsuarios } from '../controllers/usuarios.controller.js'

const router = Router()

router.get('/usuarios/lista', getUsuarios);

router.post('/usuarios/crea', createUsuarios);

router.patch('/usuarios/actualiza/:cod_usu', updateUsuarios); 

router.delete('/usuarios/elimina/:cod_usu', deleteUsuarios); 

export default router

