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

 //Mettre à jour le statut
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
// Réinitialiser tous les appels + interventions liées
router.delete('/reset', async (req, res) => {
  const Appel = require('../models/Appel');
  const Intervention = require('../models/Intervention');

  try {
    // Récupérer tous les appels
    const appels = await Appel.find({});
    const appelIds = appels.map(appel => appel._id);

    // Supprimer toutes les interventions liées à ces appels
    await Intervention.deleteMany({ appelId: { $in: appelIds } });

    // Ensuite, supprimer les appels
    await Appel.deleteMany({ _id: { $in: appelIds } });

    console.log("🧹 Tous les appels et interventions supprimés.");
    res.json({ message: 'Appels et interventions réinitialisés' });
  } catch (err) {
    console.error("Erreur lors de la réinitialisation :", err);
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
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

    // Après sauvegarde, lancer l'affectation automatique
    await prioriserEtAffecterAmbulances();

    return res.status(201).json(appel);
  } catch (error) {
    console.error('Erreur création appel manuel:', error);
    return res.status(500).json({ message: 'Erreur serveur lors de la création d\'appel manuel' });
  }
});
// ➕ Créer deux appels simulés en une seule requête
router.post('/double', async (req, res) => {
  try {
    // Générer UNE SEULE fois une date ISO complète
    const heureFixe = new Date().toISOString();

    // Créer deux appels avec exactement la même heure
    const appel1 = await genererAppel(null, heureFixe);
    const appel2 = await genererAppel(null, heureFixe);

    console.log("✅ Deux appels créés avec EXACTEMENT la même date :", heureFixe);
    res.status(201).json([appel1, appel2]);
  } catch (error) {
    console.error('Erreur lors de la création de deux appels :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de deux appels' });
  }
});
///
// ✅ Marquer l’intervention terminée + relancer affectation
/*
router.put('/:id/status', async (req, res) => {
  const intervention = await Intervention.findById(req.params.id);
  if (!intervention) return res.status(404).json({ message: "Intervention non trouvée" });

  // Marquer l’intervention comme terminée
  intervention.statut = 'terminée';
  intervention.finEstimee = new Date();
  await intervention.save();

  // Mettre à jour l’appel lié (ceci libère l’ambulance + relance l’affectation)
  const appel = await updateAppelStatus(intervention.appelId, 'terminée');

  res.json({ message: "Intervention et appel terminés", appel });
});

*/


module.exports = router;