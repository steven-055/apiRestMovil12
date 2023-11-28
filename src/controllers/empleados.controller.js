import { pool } from '../db.js';
import bcrypt from 'bcrypt';

export const getEmpleados = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT cod_empleado, email, idrol, id_Ubi, nombre, apellido, dni, telefono FROM tb_empleados');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'ALGO SALIÓ MAL'
        });
    }
};


export const createEmpleados = async (req, res) => {
    try {
        const { email, password, idrol, id_Ubi, nombre, apellido, dni, telefono } = req.body;

        if (!email || !password || !idrol || !id_Ubi || !nombre || !apellido || !dni || !telefono) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        // Check if the provided email already exists
        const [existingEmailRows] = await pool.query('SELECT * FROM tb_empleados WHERE email = ?', [email]);
        if (existingEmailRows.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya existe en la base de datos' });
        }

        // Check if the provided DNI already exists
        const [existingDniRows] = await pool.query('SELECT * FROM tb_empleados WHERE dni = ?', [dni]);
        if (existingDniRows.length > 0) {
            return res.status(400).json({ message: 'El DNI ya existe en la base de datos' });
        }

        // Check if the provided telefono already exists
        const [existingTelefonoRows] = await pool.query('SELECT * FROM tb_empleados WHERE telefono = ?', [telefono]);
        if (existingTelefonoRows.length > 0) {
            return res.status(400).json({ message: 'El número de teléfono ya existe en la base de datos' });
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
        });
    }
};

export const updateEmpleados = async (req, res) => {
    try {
        const userId = req.params.cod_empleado;
        const { email, password, idrol, id_Ubi, nombre, apellido, dni, telefono } = req.body;

        // Check if the new email already exists (excluding the current user)
        const [existingEmailRows] = await pool.query('SELECT * FROM tb_empleados WHERE email = ? AND cod_empleado != ?', [email, userId]);
        if (existingEmailRows.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya existe en la base de datos' });
        }

        // Check if the new DNI already exists (excluding the current user)
        const [existingDniRows] = await pool.query('SELECT * FROM tb_empleados WHERE dni = ? AND cod_empleado != ?', [dni, userId]);
        if (existingDniRows.length > 0) {
            return res.status(400).json({ message: 'El DNI ya existe en la base de datos' });
        }

        // Check if the new telefono already exists (excluding the current user)
        const [existingTelefonoRows] = await pool.query('SELECT * FROM tb_empleados WHERE telefono = ? AND cod_empleado != ?', [telefono, userId]);
        if (existingTelefonoRows.length > 0) {
            return res.status(400).json({ message: 'El número de teléfono ya existe en la base de datos' });
        }

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
        });
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
