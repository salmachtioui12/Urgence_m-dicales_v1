const express = require('express');
const router = express.Router();
const Appel = require('../models/Appel'); // <-- ajoute ça en haut, avec les autres requires

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
// Réinitialiser tous les appels
router.delete('/reset', async (req, res) => {
  const Appel = require('../models/Appel');
  await Appel.deleteMany({});
  console.log("🧹 Tous les appels supprimés.");
  res.json({ message: 'Appels réinitialisés' });
});

// Générer plusieurs appels critiques (surcharge test)
router.post('/surcharge', async (req, res) => {
  const { genererAppel } = require('../services/appels.service');
  const appels = [];
  for (let i = 0; i < 10; i++) {
    appels.push(await genererAppel("critique"));
  }
  console.log("⚠️ 10 appels critiques générés.");
  res.json(appels);
});
router.post('/manual', async (req, res) => {
  try {
    const { description, patientName, localisation, gravite, lat, lng } = req.body;

    if (!patientName || !gravite || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }

    const appel = new Appel({
      description: description || `Appel manuel - ${gravite}`,
      patientName,
      localisation: localisation || 'Casablanca',
      gravite,
      heureAppel: new Date(),
      position: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      },
      ambulanceAffectee: null,
      etat: 'en attente',
    });

    await appel.save();

    return res.status(201).json(appel);
  } catch (error) {
    console.error('Erreur création appel manuel:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la création d\'appel manuel' });
  }
});



module.exports = router;