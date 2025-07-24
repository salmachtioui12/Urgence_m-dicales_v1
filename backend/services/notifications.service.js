const Notification = require('../models/Notification');
const Appel = require('../models/Appel');
const { notifierCasCritique } = require('../websocket');

async function verifierEtNotifierCritiquesNonAffectes() {
  const appelsCritiques = await Appel.find({
    gravite: 'critique',
    ambulanceAffectee: null,
      notifie: false
  });

  for (const appel of appelsCritiques) {
    const existe = await Notification.findOne({ appelId: appel._id });
    if (existe) continue;

    const notificationData = {
      appelId: appel._id,
      patientName: appel.patientName,
      localisation: appel.localisation,
      heureAppel: appel.heureAppel,
      gravite: appel.gravite,
      dateNotification: new Date()
    };

    const notif = new Notification(notificationData);
    await notif.save();
await Appel.findByIdAndUpdate(appel._id, { notifie: true });

    notifierCasCritique({
      _id: notif._id,
      ...notificationData
    });
  }
}

// Supprimer toutes les notifications
const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.status(200).json({ message: 'Toutes les notifications ont été supprimées.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression des notifications.' });
  }
};

// Supprimer une notification spécifique
const deleteNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Notification non trouvée.' });
    }
    res.status(200).json({ message: 'Notification supprimée.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la notification.' });
  }
};
module.exports = { verifierEtNotifierCritiquesNonAffectes,
    deleteAllNotifications,
  deleteNotificationById
 };
