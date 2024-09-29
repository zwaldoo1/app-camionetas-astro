// models/Camioneta.js
const mongoose = require('mongoose');

const CamionetaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    disponible: {
        type: Boolean,
        default: true,
    },
    // Puedes agregar más campos según tus necesidades
});

const Camioneta = mongoose.model('Camioneta', CamionetaSchema);

module.exports = Camioneta;
