const express = require('express');
const mongoose = require('mongoose');
const Camioneta = require('./models/camioneta.js'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Middleware para parsear JSON
app.use(express.json());

// Ruta para la raíz
app.get('/', (req, res) => {
  res.send('Bienvenido al servidor de reserva de camionetas');
});

// Ruta para obtener la lista de camionetas
app.get('/api/camionetas', async (req, res) => {
  try {
    const camionetas = await Camioneta.find(); // Obtener todas las camionetas
    res.json(camionetas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener las camionetas', error: err });
  }
});

// Ruta para reservar una camioneta
app.post('/api/reservar-camioneta/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const camioneta = await Camioneta.findById(id);
    if (!camioneta) {
      return res.status(404).json({ message: 'Camioneta no encontrada' });
    }

    if (!camioneta.disponible) {
      return res.status(400).json({ message: 'Camioneta ya reservada' });
    }

    camioneta.disponible = false; // Marcar la camioneta como no disponible
    await camioneta.save(); // Guardar los cambios

    res.json({ message: 'Camioneta reservada exitosamente', camioneta });
  } catch (err) {
    res.status(500).json({ message: 'Error al reservar la camioneta', error: err });
  }
});

// Ruta para agregar una nueva camioneta
app.post('/api/camionetas', async (req, res) => {
  const { nombre } = req.body;

  try {
    const nuevaCamioneta = new Camioneta({ nombre });
    await nuevaCamioneta.save();
    res.status(201).json({ message: 'Camioneta agregada exitosamente', nuevaCamioneta });
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar la camioneta', error: err });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
require('dotenv').config(); // Cargar las variables de entorno
console.log('URI de MongoDB:', process.env.MONGO_URI); // Esto debe mostrar tu URI
