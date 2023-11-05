import { pool } from '../db.js';
import bcrypt from 'bcrypt';

export const getUsuarios = async (req, res) => {

    try {
        const [rows] = await pool.query('SELECT * FROM tb_usuario');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'ALGO SALIO MAL'
        })

    }
}

export const createUsuarios = async (req, res) => {
    try {
        const { login, password, idrol, id_Ubi, nombre, apellido, dni, telefono } = req.body;


        if (!login || !password || !idrol || !id_Ubi || !nombre || !apellido || !dni || !telefono) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const [rows] = await pool.query(
            'INSERT INTO tb_usuario(login, password, idrol, id_Ubi, nombre, apellido, dni, telefono) VALUES (?, ?,  ?,  ?, ?, ?, ?, ?)',
            [login, hashedPassword, idrol, id_Ubi, nombre, apellido, dni, telefono]
        );

        res.send({
            cod_usu: rows.insertId,
            login,
            idrol,
            id_Ubi,
            nombre,
            apellido,
            dni,
            telefono,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'ALGO SALIO MAL'
        })

    }
};
export const updateUsuarios = async (req, res) => {
    try {
        
        const userId = req.params.cod_usu;
        const { login, password, idrol, id_Ubi, nombre, apellido, dni, telefono } = req.body;

        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        const [result] = await pool.query(
            'UPDATE tb_usuario SET login = IFNULL(?, login), password = IFNULL(?, password), idrol = IFNULL(?, idrol), id_Ubi = IFNULL(?, id_Ubi), nombre = IFNULL(?, nombre), apellido = IFNULL(?, apellido), dni = IFNULL(?, dni), telefono = IFNULL(?, telefono) WHERE cod_usu = ?',
            [login, hashedPassword, idrol, id_Ubi, nombre, apellido, dni, telefono, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const [rows] = await pool.query('SELECT * FROM tb_usuario WHERE cod_usu = ?', [userId]);

        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'ALGO SALIO MAL'
        })
    }
};


export const deleteUsuarios = async (req, res) => {
    try {
        const userId = req.params.cod_usu;
        const [result] = await pool.query('DELETE FROM tb_usuario WHERE cod_usu = ?', [userId]);

        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Usuario No eliminado'
        })
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: 'ALGO SALIO MAL'
        })
    }

}
