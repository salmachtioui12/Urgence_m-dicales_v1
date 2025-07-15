const mongoose = require("mongoose");

const InterventionSchema = new mongoose.Schema({
  appelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appel",
    required: true,
  },
  ambulanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ambulance",
    required: true,
  },
  gravite: {
    type: String,
    enum: ["faible", "moyenne", "critique"],
    required: true,
  },
  localisation: String,
  patientName: String,
  debutIntervention: {
    type: Date,
    default: Date.now,
  },
  finEstimee: Date, // utile pour simulation
  statut: {
    type: String,
    enum: ["en cours", "terminée"],
    default: "en cours",
  }
}, { timestamps: true });

module.exports = mongoose.model("Intervention", InterventionSchema);
