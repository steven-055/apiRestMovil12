import express from 'express'
import empleadoRoutes from './routes/empleados.routes.js'
import clientesRoutes from './routes/clientes.routes.js'
import sedesRoutes from './routes/sedes.routes.js'



const app = express();


app.use(express.json())

app.use('/api', sedesRoutes)
app.use('/api', empleadoRoutes)
app.use('/api', clientesRoutes)

app.use((req, res, next) => {
    res.status(404).json({
        message: "NO ENCONTRADO"
    })

})

export default app;