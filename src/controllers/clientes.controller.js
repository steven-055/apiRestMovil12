import { pool } from '../db.js';
import bcrypt from 'bcrypt';

export const getClientes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tb_cliente');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'ALGO SALIO MAL'
        });
    }
};

export const createClientes = async (req, res) => {
    try {
        const { nombre, apellido, dni, telefono, email, id_Ubi, id_Habi, password } = req.body;

        if (!nombre || !apellido || !dni || !telefono || !email || !id_Ubi || !password) {
            return res.status(400).json({ message: 'Error al crear' });
        }

        const [existingDniRows] = await pool.query('SELECT * FROM tb_cliente WHERE dni = ?', [dni]);
        if (existingDniRows.length > 0) {
            return res.status(400).json({ message: 'El DNI ya existe en la base de datos' });
        }

        const [existingEmailRows] = await pool.query('SELECT * FROM tb_cliente WHERE email = ?', [email]);
        if (existingEmailRows.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya existe en la base de datos' });
        }

        const [existingTelefonoRows] = await pool.query('SELECT * FROM tb_cliente WHERE telefono = ?', [telefono]);
        if (existingTelefonoRows.length > 0) {
            return res.status(400).json({ message: 'El número de teléfono ya existe en la base de datos' });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

        let query;
        let values;

        if (id_Habi) {
            query = 'INSERT INTO tb_cliente(nombre, apellido, dni, telefono, email, id_Ubi, id_Habi, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            values = [nombre, apellido, dni, telefono, email, id_Ubi, id_Habi, hashedPassword];
        } else {
            query = 'INSERT INTO tb_cliente(nombre, apellido, dni, telefono, email, id_Ubi, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
            values = [nombre, apellido, dni, telefono, email, id_Ubi, hashedPassword];
        }

        const [rows] = await pool.query(query, values);

        res.send({
            cod_cliente: rows.insertId,
            nombre,
            apellido,
            dni,
            telefono,
            email,
            id_Ubi,
            id_Habi,
            password: hashedPassword, // Avoid sending the original password in the response

        });
        
    } catch (error) {
        return res.status(500).json({
            message: 'ALGO SALIO MAL',
        });
    }
};


export const updateClientes = async (req, res) => {
    try {
        const clientId = req.params.cod_cliente;
        const { nombre, apellido, dni, telefono, email, id_Ubi, id_Habi, password, idrol } = req.body;

        // Check if the new DNI already exists
        const [existingDniRows] = await pool.query('SELECT * FROM tb_cliente WHERE dni = ? AND cod_cliente != ?', [dni, clientId]);
        if (existingDniRows.length > 0) {
            return res.status(400).json({ message: 'El DNI ya existe en la base de datos' });
        }

        // Check if the new email already exists
        const [existingEmailRows] = await pool.query('SELECT * FROM tb_cliente WHERE email = ? AND cod_cliente != ?', [email, clientId]);
        if (existingEmailRows.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya existe en la base de datos' });
        }

        // Check if the new telefono already exists
        const [existingTelefonoRows] = await pool.query('SELECT * FROM tb_cliente WHERE telefono = ? AND cod_cliente != ?', [telefono, clientId]);
        if (existingTelefonoRows.length > 0) {
            return res.status(400).json({ message: 'El número de teléfono ya existe en la base de datos' });
        }

        // Hash the password if it is provided
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
        }

        const [result] = await pool.query(
            'UPDATE tb_cliente SET nombre = IFNULL(?, nombre), apellido = IFNULL(?, apellido), dni = IFNULL(?, dni), telefono = IFNULL(?, telefono), email = IFNULL(?, email), id_Ubi = IFNULL(?, id_Ubi), id_Habi = IFNULL(?, id_Habi), password = IFNULL(?, password), idrol = IFNULL(?, idrol) WHERE cod_cliente = ?',
            [nombre, apellido, dni, telefono, email, id_Ubi, id_Habi, hashedPassword, idrol, clientId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        const [rows] = await pool.query('SELECT * FROM tb_cliente WHERE cod_cliente = ?', [clientId]);

        res.json(rows[0]);
    } catch (error) {
        console.error("Error en la función de actualización de clientes:", error);
        return res.status(500).json({
            message: 'ALGO SALIO MAL'
        });
    }
};

export const deleteClientes = async (req, res) => {
    try {
        const clientId = req.params.cod_cliente;
        const [result] = await pool.query('DELETE FROM tb_cliente WHERE cod_cliente = ?', [clientId]);

        if (result.affectedRows <= 0) {
            return res.status(404).json({
                message: 'Cliente no eliminado'
            });
        }
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'ALGO SALIO MAL'
        });
    }
};