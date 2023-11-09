import { pool } from '../db.js';
import bcrypt from 'bcrypt';

export const getEmpleados = async (req, res) => {

    try {
        const [rows] = await pool.query('SELECT * FROM tb_empleados');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'ALGO SALIO MAL'
        })

    }
}

export const createEmpleados = async (req, res) => {
    try {
        const { email, password, idrol, id_Ubi, nombre, apellido, dni, telefono } = req.body;

        
        if (!email || !password || !idrol || !id_Ubi || !nombre || !apellido || !dni || !telefono) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const [rows] = await pool.query(
            'INSERT INTO tb_empleados(email, password, idrol, id_Ubi, nombre, apellido, dni, telefono) VALUES (?, ?,  ?,  ?, ?, ?, ?, ?)',
            [email, hashedPassword, idrol, id_Ubi, nombre, apellido, dni, telefono]
        );

        res.send({
            cod_empleado: rows.insertId,
            email,
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




export const updateEmpleados = async (req, res) => {
    try {
        
        const userId = req.params.cod_empleado;
        const { email, password, idrol, id_Ubi, nombre, apellido, dni, telefono } = req.body;

        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        const [result] = await pool.query(
            'UPDATE tb_empleados SET email = IFNULL(?, email), password = IFNULL(?, password), idrol = IFNULL(?, idrol), id_Ubi = IFNULL(?, id_Ubi), nombre = IFNULL(?, nombre), apellido = IFNULL(?, apellido), dni = IFNULL(?, dni), telefono = IFNULL(?, telefono) WHERE cod_empleado = ?',
            [email, hashedPassword, idrol, id_Ubi, nombre, apellido, dni, telefono, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        const [rows] = await pool.query('SELECT * FROM tb_empleados WHERE cod_empleado = ?', [userId]);

        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'ALGO SALIO MAL'
        })
    }
};


export const deleteEmpleados = async (req, res) => {
    try {
        const userId = req.params.cod_empleado;
        const [result] = await pool.query('DELETE FROM tb_empleados WHERE cod_empleado = ?', [userId]);

        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Empleado No eliminado'
        })
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({
            message: 'ALGO SALIO MAL'
        })
    }

}
