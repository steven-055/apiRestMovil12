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
    try {
        const sedeId = req.params.id_Ubi; 
        const { distrito } = req.body;

        const [result] = await pool.query(
            'UPDATE tb_sedes SET distrito = IFNULL(?, distrito) WHERE id_Ubi = ?',
            [distrito, sedeId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Sede no encontrada' });
        }

        res.json({ message: 'Sede actualizada correctamente' });
    } catch (error) {
        return res.status(500).json({
            message: 'ALGO SALIÓ MAL'
        });
    }
};




export const deleteSede = async (req, res) => {
    try {
        const sedeId = req.params.id_Ubi; 
        const [result] = await pool.query('DELETE FROM tb_sedes WHERE id_Ubi = ?', [sedeId]);

        if (result.affectedRows <= 0) {
            return res.status(404).json({
                message: 'Sede no eliminada'
            });
        }
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'ALGO SALIÓ MAL'
        });
    }
};
