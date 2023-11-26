import { pool } from '../db.js';

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

        // Validar si el DNI ya existe en la base de datos
        const [existingDniRows] = await pool.query('SELECT * FROM tb_cliente WHERE dni = ?', [dni]);
        if (existingDniRows.length > 0) {
            return res.status(400).json({ message: 'El DNI ya existe en la base de datos' });
        }

        // Validar si el correo electrónico ya existe en la base de datos
        const [existingEmailRows] = await pool.query('SELECT * FROM tb_cliente WHERE email = ?', [email]);
        if (existingEmailRows.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya existe en la base de datos' });
        }

        // Validar si el número de teléfono ya existe en la base de datos
        const [existingTelefonoRows] = await pool.query('SELECT * FROM tb_cliente WHERE telefono = ?', [telefono]);
        if (existingTelefonoRows.length > 0) {
            return res.status(400).json({ message: 'El número de teléfono ya existe en la base de datos' });
        }

        // Resto del código para la inserción en la base de datos
        let query;
        let values;

        if (id_Habi) {
            query = 'INSERT INTO tb_cliente(nombre, apellido, dni, telefono, email, id_Ubi, id_Habi, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            values = [nombre, apellido, dni, telefono, email, id_Ubi, id_Habi, password];
        } else {
            query = 'INSERT INTO tb_cliente(nombre, apellido, dni, telefono, email, id_Ubi, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
            values = [nombre, apellido, dni, telefono, email, id_Ubi, password];
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
            password,
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

        const [result] = await pool.query(
            'UPDATE tb_cliente SET nombre = IFNULL(?, nombre), apellido = IFNULL(?, apellido), dni = IFNULL(?, dni), telefono = IFNULL(?, telefono), email = IFNULL(?, email), id_Ubi = IFNULL(?, id_Ubi), id_Habi = IFNULL(?, id_Habi), password = IFNULL(?, password), idrol = IFNULL(?, idrol) WHERE cod_cliente = ?',
            [nombre, apellido, dni, telefono, email, id_Ubi, id_Habi, password, idrol, clientId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.json({ message: 'Cliente actualizado correctamente' });
    } catch (error) {
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
export const loginClientes = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor, proporcione un correo electrónico y una contraseña' });
        }

        const [rows] = await pool.query('SELECT * FROM tb_cliente WHERE email = ? AND password = ?', [email, password]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        // Aquí podrías generar un token de autenticación para el cliente si la autenticación es exitosa

        return res.status(200).json({ message: 'Inicio de sesión exitoso' }); // Puedes ajustar el mensaje y los datos que deseas devolver en la respuesta.
    } catch (error) {
        console.error("Error en la función de inicio de sesión:", error);
        return res.status(500).json({
            message: 'ALGO SALIO MAL',
        });
    }
};
