

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








