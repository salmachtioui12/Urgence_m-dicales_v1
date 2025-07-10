const mongoose = require("mongoose");

const AmbulanceSchema = new mongoose.Schema({
  id: Number,
  type: {
    type: String,
    enum: ['A', 'B', 'C'],
    required: true,
  },
  etat: {
    type: String,
    enum: ['disponible', 'en mission'],
    default: 'disponible',
  },
  position: {
    lat: Number,
    lng: Number,
  },
  hopitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hopital",
    required: true,
  },
});

module.exports = mongoose.model("Ambulance", AmbulanceSchema);
