

import { pool } from '../db.js';




export const getSedes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tb_sedes');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'ALGO SALIO MAL'
        });
    }
};








export const createSede = async (req, res) => {
    const { distrito } = req.body;

    try {
        const result = await pool.query('INSERT INTO tb_sedes (distrito) VALUES (?)', [distrito]);
        res.json({ id: result.insertId, message: 'Sede registrada exitosamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al registrar la sede.' });
    }
};

export const updateSede = async (req, res) => {
    const id_Ubi = req.params.id; // Obtener el id desde la URL
    const { distrito } = req.body;

    try {
        const result = await pool.query('UPDATE tb_sedes SET distrito = ? WHERE id_Ubi = ?', [distrito, id_Ubi]);

        if (result.affectedRows > 0) {
            res.json({ message: 'Sede actualizada exitosamente.' });
        } else {
            res.status(404).json({ message: 'Sede no encontrada.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar la sede.' });
    }
};

export const deleteSede = async (req, res) => {
    const id_Ubi = req.params.id;

    try {
        const result = await pool.query('DELETE FROM tb_sedes WHERE id_Ubi = ?', [id_Ubi]);

        if (result.affectedRows > 0) {
            res.json({ message: 'Sede eliminada exitosamente.' });
        } else {
            res.status(404).json({ message: 'Sede no encontrada.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar la sede.' });
    }
};
