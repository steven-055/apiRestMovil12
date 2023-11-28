import bcrypt from 'bcrypt';
import { pool } from '../db.js';

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Por favor, proporcione un correo electrónico y una contraseña' });
        }

        // Buscar en ambas tablas (tb_cliente y tb_empleados)
        const [rowsClientes] = await pool.query('SELECT * FROM tb_cliente WHERE email = ?', [email]);
        const [rowsEmpleados] = await pool.query('SELECT * FROM tb_empleados WHERE email = ?', [email]);

        if (rowsClientes.length === 0 && rowsEmpleados.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = rowsClientes.length > 0 ? rowsClientes[0] : rowsEmpleados[0];
        const userTypeName = rowsClientes.length > 0 ? 'Usuario' : 'Empleado';

        // Compare la contraseña proporcionada con la contraseña almacenada en la base de datos
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        return res.status(200).json({ message: `Inicio de sesión exitoso como ${userTypeName}` });
    } catch (error) {
        console.error("Error en la función de inicio de sesión:", error);
        return res.status(500).json({
            message: 'ALGO SALIÓ MAL',
        });
    }
};
