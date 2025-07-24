const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  appelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appel', required: true },
  patientName: String,
  localisation: String,
  heureAppel: Date,
  gravite: String,
  dateNotification: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
