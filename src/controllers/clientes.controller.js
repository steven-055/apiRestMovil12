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
        const { nombre, apellido, dni, telefono, email, id_Ubi, id_Habi } = req.body;

        if (!nombre || !apellido || !dni || !telefono || !email || !id_Ubi) {
            return res.status(400).json({ message: 'Error al crear' });
        }

        // Verificar si ya existe un cliente con el mismo email o dni o telefono
        const existingClient = await pool.query(
            'SELECT * FROM tb_cliente WHERE email = ? OR dni = ? OR telefono = ?',
            [email, dni, telefono]
        );

        if (existingClient.length > 0) {
            return res.status(409).json({ message: 'Ya existe una cuenta con el mismo correo, DNI o teléfono.' });
        }

        let query;
        let values;

        if (id_Habi) {
            query = 'INSERT INTO tb_cliente(nombre, apellido, dni, telefono, email, id_Ubi, id_Habi) VALUES (?, ?, ?, ?, ?, ?, ?)';
            values = [nombre, apellido, dni, telefono, email, id_Ubi, id_Habi];
        } else {
            query = 'INSERT INTO tb_cliente(nombre, apellido, dni, telefono, email, id_Ubi) VALUES (?, ?, ?, ?, ?, ?)';
            values = [nombre, apellido, dni, telefono, email, id_Ubi];
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
        });
    } catch (error) {
        return res.status(500).json({
            message: 'ALGO SALIO MAL'
        });
    }
};


 
export const updateClientes = async (req, res) => {
    try {
        const clientId = req.params.cod_cliente;
        const { nombre, apellido, dni, telefono, email, id_Ubi, id_Habi } = req.body;

        const [result] = await pool.query(
            'UPDATE tb_cliente SET nombre = IFNULL(?, nombre), apellido = IFNULL(?, apellido), dni = IFNULL(?, dni), telefono = IFNULL(?, telefono), email = IFNULL(?, email), id_Ubi = IFNULL(?, id_Ubi), id_Habi = IFNULL(?, id_Habi) WHERE cod_cliente = ?',
            [nombre, apellido, dni, telefono, email, id_Ubi, id_Habi, clientId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        const [rows] = await pool.query('SELECT * FROM tb_cliente WHERE cod_cliente = ?', [clientId]);

        res.json(rows[0]);
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
