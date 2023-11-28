import { pool } from '../db.js';


export const getAllHabitaciones = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tb_habitacion_sede');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: 'ALGO SALIÓ MAL' });
    }
};

export const getHabitaciones = async (req, res) => {
    const id_Ubi = req.params.id_Ubi; 
    try {
        const [rows] = await pool.query('SELECT * FROM tb_habitacion_sede WHERE id_Ubi = ?', [id_Ubi]);
        res.json(rows);
    } catch (error) {
        return res.status(500).json({ message: 'ALGO SALIÓ MAL' });
    }
};


export const createHabitacion = async (req, res) => {
    try {
        // Your code to extract values from the request body
        const { descripcion, id_Ubi, tipo, precio } = req.body;

        // Your validation code for the new room fields
        if (!descripcion || !id_Ubi || !tipo || !precio) {
            return res.status(400).json({ message: 'Error creating room in sede' });
        }

        // Your code to insert into 'tb_habitacion_sede'
        const query = 'INSERT INTO tb_habitacion_sede(descripcion, id_Ubi, tipo, precio) VALUES (?, ?, ?, ?)';
        const values = [descripcion, id_Ubi, tipo, precio];

        const [rows] = await pool.query(query, values);

        // Your response code for the new room creation
        res.send({
            id_Habi: rows.insertId,
            descripcion,
            id_Ubi,
            tipo,
            precio,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong',
        });
    }
};


export const updateHabitacion = async (req, res) => {
    try {
        // Extraer el ID de la habitación a actualizar de los parámetros de la solicitud
        const id_Habi = req.params.id_Habi;

        // Extraer los nuevos valores de la habitación del cuerpo de la solicitud
        const { descripcion, id_Ubi, tipo, precio } = req.body;

        // Validar que se proporcionen todos los campos necesarios
        if (!descripcion || !id_Ubi || !tipo || !precio) {
            return res.status(400).json({ message: 'Error updating room in sede' });
        }

        // Crear la consulta SQL para actualizar la habitación
        const query = 'UPDATE tb_habitacion_sede SET descripcion = ?, id_Ubi = ?, tipo = ?, precio = ? WHERE id_Habi = ?';
        const values = [descripcion, id_Ubi, tipo, precio, id_Habi];

        // Ejecutar la consulta y obtener el resultado
        const [rows] = await pool.query(query, values);

        // Verificar si la habitación se actualizó correctamente
        if (rows.affectedRows === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Enviar una respuesta con los detalles de la habitación actualizada
        res.json({
            id_Habi,
            descripcion,
            id_Ubi,
            tipo,
            precio,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong' });
    }
};



export const deleteHabitacion = async (req, res) => {
    try {
        const habitacionId = req.params.id_Habi;
        const [result] = await pool.query('DELETE FROM tb_habitacion_sede WHERE id_Habi = ?', [habitacionId]);

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: 'Habitación no eliminada' });
        }
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: 'ALGO SALIÓ MAL' });
    }
};
