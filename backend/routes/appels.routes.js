const express = require('express');
const router = express.Router();
const { getAppels, updateAppelStatus } = require('../services/appels.service');

router.get('/', (req, res) => res.json(getAppels()));

router.put('/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const appel = updateAppelStatus(id, status);
  if (!appel) return res.status(404).json({ message: 'Appel non trouvé' });
  res.json({ message: 'Statut mis à jour', appel });
});

module.exports = router;