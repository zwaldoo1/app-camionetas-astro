// routes/reservas.js
const express = require('express');
const Camioneta = require('../models/camioneta.js');
const router = express.Router();

// Obtener las reservas activas de un usuario
router.get('/mis-reservas', async (req, res) => {
  const usuarioId = req.user.id; // Asume que el usuario está autenticado y el middleware añade el ID del usuario
  try {
    const camionetasReservadas = await Camioneta.find({ reservadoPor: usuarioId });
    res.json(camionetasReservadas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
});

// Cancelar una reserva
router.post('/cancelar-reserva/:id', async (req, res) => {
  const camionetaId = req.params.id;
  try {
    const camioneta = await Camioneta.findById(camionetaId);
    if (!camioneta) return res.status(404).json({ error: 'Camioneta no encontrada' });
    
    // Verifica si la camioneta está reservada por el usuario
    if (camioneta.reservadoPor !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para cancelar esta reserva' });
    }

    camioneta.disponible = true;
    camioneta.reservadoPor = null;
    await camioneta.save();

    res.json({ message: 'Reserva cancelada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar la reserva' });
  }
});

module.exports = router;
