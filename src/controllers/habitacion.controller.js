

import { pool } from '../db.js';


export const getAllHabitaciones = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tb_habitacion_sede');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: 'ALGO SALIÓ MAL' });
    }
};

export const getHabitaciones = async (req, res) => {
    const id_Ubi = req.params.id_Ubi; 
    try {
        const [rows] = await pool.query('SELECT * FROM tb_habitacion_sede WHERE id_Ubi = ?', [id_Ubi]);
        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: 'ALGO SALIÓ MAL' });
    }
};

export const createHabitacion = async (req, res) => {
    const { descripcion, id_Ubi } = req.body;

    try {
        const result = await pool.query('INSERT INTO tb_habitacion_sede (descripcion, id_Ubi) VALUES (?, ?)', [descripcion, id_Ubi]);
        res.json({ id: result.insertId, message: 'Habitación creada exitosamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear la habitación.' });
    }
};

export const updateHabitacion = async (req, res) => {
    try {
        const habitacionId = req.params.id_Habi; 
        const { descripcion, id_Ubi } = req.body;

        const [result] = await pool.query(
            'UPDATE tb_habitacion_sede SET descripcion = IFNULL(?, descripcion), id_Ubi = IFNULL(?, id_Ubi) WHERE id_Habi = ?',
            [descripcion, id_Ubi, habitacionId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Habitación no encontrada' });
        }

        res.json({ message: 'Habitación actualizada correctamente' });
    } catch (error) {
        return res.status(500).json({ message: 'ALGO SALIÓ MAL' });
    }
};


export const deleteHabitacion = async (req, res) => {
    try {
        const habitacionId = req.params.id_Habi;
        const [result] = await pool.query('DELETE FROM tb_habitacion_sede WHERE id_Habi = ?', [habitacionId]);

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Habitación no eliminada' });
        }
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: 'ALGO SALIÓ MAL' });
    }
};
