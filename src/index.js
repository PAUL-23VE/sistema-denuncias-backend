require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
const denunciasRouter = require('./routes/denuncias');

const app = express();
const PORT = process.env.PORT || 5000;

// Seguridad y parseo
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
  ],
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Rutas
app.use('/api/denuncias', denunciasRouter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Manejo de rutas no encontradas
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }));

// Sync DB y arrancar servidor
const iniciar = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL exitosa.');

    // alter: true actualiza la tabla si cambian los modelos (sin borrar datos)
    await sequelize.sync({ alter: true });
    console.log('Base de datos sincronizada.');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar:', error);
    process.exit(1);
  }
};

iniciar();