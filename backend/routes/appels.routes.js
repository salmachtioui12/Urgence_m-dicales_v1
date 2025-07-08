const express = require('express');
const router = express.Router();
const {
  getAppels,
  updateAppelStatus,
  startAutoGeneration,
  stopAutoGeneration,
  genererAppel,
} = require('../services/appels.service');

// Récupérer tous les appels
router.get('/', async (req, res) => {
  const appels = await getAppels();
  res.json(appels);
});

// Mettre à jour le statut
router.put('/:id/status', async (req, res) => {
  const appel = await updateAppelStatus(req.params.id, req.body.status);
  if (!appel) return res.status(404).json({ message: 'Appel non trouvé' });
  res.json({ message: 'Statut mis à jour', appel });
});

// Démarrer la génération auto
router.post('/start', (req, res) => {
  startAutoGeneration();
  res.json({ message: 'Génération démarrée' });
});

// Arrêter la génération auto
router.post('/stop', (req, res) => {
  stopAutoGeneration();
  res.json({ message: 'Génération arrêtée' });
});

// Ajouter un appel manuellement (optionnel)
router.post('/add', async (req, res) => {
  console.log('📩 Requête reçue sur /appels/add');
  const appel = await genererAppel();
  res.json(appel);
});


module.exports = router;
