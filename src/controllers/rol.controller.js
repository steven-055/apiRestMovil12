import { pool } from '../db.js';

export const getRoles = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tb_rol');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: 'ALGO SALIÓ MAL' });
    }
};

export const createRol = async (req, res) => {
    const { descripcion } = req.body;

    try {
        const result = await pool.query('INSERT INTO tb_rol (descripcion) VALUES (?)', [descripcion]);
        res.json({ id: result.insertId, message: 'Rol creado exitosamente.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear el rol.' });
    }
};


export const updateRol = async (req, res) => {
    try {
        const rolId = req.params.idrol; 
        const { descripcion } = req.body;

        const [result] = await pool.query(
            'UPDATE tb_rol SET descripcion = IFNULL(?, descripcion) WHERE idrol = ?',
            [descripcion, rolId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }

        res.json({ message: 'Rol actualizado correctamente' });
    } catch (error) {
        return res.status(500).json({ message: 'ALGO SALIÓ MAL' });
    }
};

export const deleteRol = async (req, res) => {
    try {
        const rolId = req.params.idrol;
        const [result] = await pool.query('DELETE FROM tb_rol WHERE idrol = ?', [rolId]);

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Rol no eliminado' });
        }
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: 'ALGO SALIÓ MAL' });
    }
};
