// routes/camionetas.js
const express = require('express');
const router = express.Router();
const Camioneta = require('../models/camioneta.js');

// Obtener todas las camionetas
router.get('/', async (req, res) => {
    try {
        const camionetas = await Camioneta.find();
        res.json(camionetas);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las camionetas' });
    }
});

// Reservar una camioneta
router.post('/reservar-camioneta/:id', async (req, res) => {
    try {
        const camioneta = await Camioneta.findById(req.params.id);
        if (!camioneta) {
            return res.status(404).json({ message: 'Camioneta no encontrada' });
        }
        if (!camioneta.disponible) {
            return res.status(400).json({ message: 'Camioneta ya reservada' });
        }
        camioneta.disponible = false;
        await camioneta.save();
        res.json({ message: 'Camioneta reservada exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al reservar la camioneta' });
    }
});

// Cancelar una reserva
router.post('/cancelar-reserva/:id', async (req, res) => {
    try {
        const camioneta = await Camioneta.findById(req.params.id);
        if (!camioneta) {
            return res.status(404).json({ message: 'Camioneta no encontrada' });
        }
        if (camioneta.disponible) {
            return res.status(400).json({ message: 'La camioneta ya está disponible' });
        }
        camioneta.disponible = true;
        await camioneta.save();
        res.json({ message: 'Reserva cancelada exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al cancelar la reserva' });
    }
});

module.exports = router;
