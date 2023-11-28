// Import the database connection pool
import { pool } from '../db.js';

// Get all reservations
export const getReservas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tb_reserva');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong while fetching reservations.'
        });
    }
};

// Create a new reservation
export const createReserva = async (req, res) => {
    const {
        nombre,
        apellido,
        dni,
        telefono,
        email,
        fec_Entrada,
        fec_Salida,
        id_Ubi,
        id_Habi,
        monto_total
    } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO tb_reserva (nombre, apellido, dni, telefono, email, fec_Entrada, fec_Salida, id_Ubi, id_Habi, monto_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, apellido, dni, telefono, email, fec_Entrada, fec_Salida, id_Ubi, id_Habi, monto_total]
        );
        res.json({ id_Reserva: result.insertId, message: 'Reservation created successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating reservation.' });
    }
};

export const updateReserva = async (req, res) => {
    try {
        const reservationId = req.params.id_Reserva;
        const updates = req.body;

        // Construct the SET clause for dynamic updates
        const setClause = Object.keys(updates)
            .map((key) => `${key} = ?`)
            .join(', ');

        // Extract the values from the updates object
        const values = Object.values(updates);

        const [result] = await pool.query(
            `UPDATE tb_reserva SET ${setClause} WHERE id_Reserva = ?`,
            [...values, reservationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json({ message: 'Reservation updated successfully' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({
            message: 'Something went wrong while updating the reservation.',
            error: error.message // Include the error message in the response for debugging
        });
    }
};


// Delete a reservation
export const deleteReserva = async (req, res) => {
    try {
        const reservationId = req.params.id_Reserva;
        const [result] = await pool.query('DELETE FROM tb_reserva WHERE id_Reserva = ?', [reservationId]);

        if (result.affectedRows <= 0) {
            return res.status(404).json({
                message: 'Reservation not deleted'
            });
        }
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong while deleting the reservation.'
        });
    }
};
 