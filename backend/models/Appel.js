const mongoose = require('mongoose');
const Intervention = require('./Intervention'); 

const appelSchema = new mongoose.Schema({
  description: String,
  patientName: String,
  localisation: String,
  heureAppel: Date,
  gravite: String,
  ambulanceAffectee: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },
  etat: String,
  position: {
    lat: Number,
    lng: Number,
  },
}, { timestamps: true });

// Avant de supprimer un appel avec findOneAndDelete, on supprime toutes ses interventions liées,this représente la requête
appelSchema.pre('findOneAndDelete', async function(next) {
  try {
    const appelId = this.getQuery()._id;
    await Intervention.deleteMany({ appelId });
    next();
  } catch (err) {
    next(err);
  }
});

// Avant de supprimer un appel avec fremove, on supprime toutes ses interventions liées,this représente l'Appel
appelSchema.pre('remove', async function(next) {
  try {
    await Intervention.deleteMany({ appelId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Appel', appelSchema);
