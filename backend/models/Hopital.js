const mongoose = require("mongoose");

const AmbulanceSchema = new mongoose.Schema({
  id: Number,
  type: {
    type: String,
    enum: ['A', 'B', 'C'], // Types autorisés
    required: true
  }
}, { _id: false }); // Pas besoin d’_id pour les sous-documents simples

const HopitalSchema = new mongoose.Schema({
  osmId: Number,
  nom: String,
  adresse: String,
  nombreAmbulances: Number,
  position: {
    lat: Number,
    lng: Number,
  },
  ambulances: [AmbulanceSchema] // Tableau de types d’ambulance
});

module.exports = mongoose.model("Hopital", HopitalSchema);
