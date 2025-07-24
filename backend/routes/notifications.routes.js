const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const {
  deleteAllNotifications,
  deleteNotificationById
} = require('../services/notifications.service');
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ dateNotification: -1 }).limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// Supprimer toutes les notifications
router.delete('/', deleteAllNotifications);

// Supprimer une notification par ID
router.delete('/:id', deleteNotificationById);
module.exports = router;
