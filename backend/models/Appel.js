const mongoose = require('mongoose');

const appelSchema = new mongoose.Schema({
  description: String,
  patientName: String,
  localisation: String,
  position: {
    lat: Number,
    lng: Number,
  },
  gravite: {
    type: String,
    enum: ["faible", "moyenne", "critique"],
  },
  heureAppel: {
    type: Date,
    default: Date.now,
  },
  etat: {
    type: String,
    enum: ["en attente", "en intervention", "terminé"],
    default: "en attente",
  },
  ambulanceAffectee: {
    type: String,
    default: null,
  },
}, { timestamps: true }); // pour createdAt et updatedAt

module.exports = mongoose.model('Appel', appelSchema);
