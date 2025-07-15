const mongoose = require('mongoose');
const Intervention = require('./Intervention'); // adapte le chemin si besoin

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

// Middleware avant suppression par findOneAndDelete ou findByIdAndDelete
appelSchema.pre('findOneAndDelete', async function(next) {
  try {
    const appelId = this.getQuery()._id;
    await Intervention.deleteMany({ appelId });
    next();
  } catch (err) {
    next(err);
  }
});

// Middleware avant suppression par remove() sur instance
appelSchema.pre('remove', async function(next) {
  try {
    await Intervention.deleteMany({ appelId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Appel', appelSchema);
