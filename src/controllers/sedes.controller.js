// Importa la conexión a la base de datos
import { pool } from '../db.js';

// Obtener todas las sedes
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

// Crear una nueva sede
export const createSede = async (req, res) => {
    const { distrito, numero, tipo } = req.body;

    try {
        // Insertar en tb_sedes
        const resultSede = await pool.query('INSERT INTO tb_sedes (distrito) VALUES (?)', [distrito]);

        // Obtener el ID de la sede recién insertada
        const sedeId = resultSede.insertId;

        // Insertar en tb_habitacion_sede
        await pool.query('INSERT INTO tb_habitacion_sede (id_Ubi, numero, tipo) VALUES (?, ?, ?)', [sedeId, numero, tipo]);

        res.json({ id: sedeId, message: 'Sede registrada exitosamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al registrar la sede.' });
    }
};


// Actualizar una sede
export const updateSede = async (req, res) => {
    try {
        const sedeId = req.params.id_Ubi;
        const { distrito } = req.body;

        // Actualizar la sede
        const [resultSede] = await pool.query(
            'UPDATE tb_sedes SET distrito = IFNULL(?, distrito) WHERE id_Ubi = ?',
            [distrito, sedeId]
        );

        if (resultSede.affectedRows === 0) {
            return res.status(404).json({ message: 'Sede no encontrada' });
        }

        // Actualizar los precios en tb_habitacion_sede según el tipo de habitación
        const [resultUpdatePrecios] = await pool.query(`
            UPDATE tb_habitacion_sede
            SET precio = 
                CASE tipo
                    WHEN 'simple' THEN 60
                    WHEN 'business' THEN 340
                    WHEN 'presidencial' THEN 850
                    ELSE precio
                END
            WHERE id_Ubi = ?;
        `, [sedeId]);

        res.json({ message: 'Sede y precios actualizados correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'ALGO SALIÓ MAL'
        });
    }
};

// Eliminar una sede
export const deleteSede = async (req, res) => {
    try {
        const sedeId = req.params.id_Ubi;
        
        // Eliminar la sede
        const [resultSede] = await pool.query('DELETE FROM tb_sedes WHERE id_Ubi = ?', [sedeId]);

        if (resultSede.affectedRows <= 0) {
            return res.status(404).json({
                message: 'Sede no eliminada'
            });
        }

        // No necesitas eliminar los precios en tb_habitacion_sede ya que se eliminarán automáticamente con la restricción FOREIGN KEY.

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'ALGO SALIÓ MAL'
        });
    }
};
