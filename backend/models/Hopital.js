const mongoose = require("mongoose");

const HopitalSchema = new mongoose.Schema({
  osmId: Number,
  nom: String,
  adresse: String,
  nombreAmbulances: Number,
  position: {
    lat: Number,
    lng: Number,
  },
});

module.exports = mongoose.model("Hopital", HopitalSchema);
