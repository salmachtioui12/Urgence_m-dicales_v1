const express = require('express');
const router = express.Router();
const Hopital = require('../models/Hopital');
const { fetchHopitauxNearby } = require('../services/hopitaux.service');
const mongoose = require('mongoose'); 
const ObjectId = mongoose.Types.ObjectId;
router.get('/', async (req, res) => {
  const { lat, lng, radius } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: "lat et lng requis" });

  try {
    const overpassHopitaux = await fetchHopitauxNearby(lat, lng, radius);

    const hopitauxComplets = await Promise.all(overpassHopitaux.map(async (hopital) => {
      const stock = await Hopital.findOne({ osmId: hopital.id });
 
      //  Remplacer adresse si absente
      const adresseFinale = hopital.adresse && hopital.adresse.trim() !== ""
        ? hopital.adresse
        : stock?.adresse ?? "Adresse inconnue";

      return {
        ...hopital,
        adresse: adresseFinale,
        nombreAmbulances: stock?.nombreAmbulances ?? null,
        ambulances: stock?.ambulances ?? []
      };
    }));

    res.json(hopitauxComplets);
  } catch (err) {
    console.error(" Erreur Overpass API:", err);
    res.status(500).json({ error: "Erreur API Overpass" });
  }
});


router.get('/stocks', async (req, res) => {
  try {
    const hopitaux = await Hopital.find();
    res.json(hopitaux);
  } catch (err) {
    res.status(500).json({ error: "Erreur MongoDB" });
  }
});
// cree hopital
router.post('/api/hopitaux', async (req, res) => {
  const { osmId, nom, adresse, position, nombreAmbulances,ambulances } = req.body;
  try {
    const hopital = new Hopital({ osmId, nom, adresse, position, nombreAmbulances,ambulances });
    await hopital.save();
    res.status(201).json(hopital);
  } catch (err) {
    res.status(500).json({ error: "Erreur enregistrement MongoDB" });
  }
});


// update hopital
router.put('/:id', async (req, res) => {
  try {
    const hopital = await Hopital.findById(req.params.id); // récupère l'hôpital
    if (!hopital) return res.status(404).json({ error: "Hôpital non trouvé" });

    // met à jour les champs
    hopital.nom = req.body.nom;
    hopital.adresse = req.body.adresse;
    hopital.position = req.body.position;
    hopital.ambulances = req.body.ambulances;

    await hopital.save(); // déclenche le middleware 'post("save")'

    res.json({
      message: "Hôpital et ambulances mis à jour avec succès",
      hopital
    });
  } catch (err) {
    console.error("Erreur de mise à jour:", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'hôpital" });
  }
});



// TEST 
router.put('/test-route/:id', async (req, res) => {
  console.log(' Route atteinte, ID:', req.params.id);
  return res.status(200).json({ test: "OK" });
});
// Route DELETE pour supprimer un hôpital
router.delete('/:id', async (req, res) => {
  console.log(" Suppression en cours pour ID :", req.params.id);
  try {
    const hopital = await Hopital.findByIdAndDelete(req.params.id);
    if (!hopital) {
      return res.status(404).json({ error: "Hôpital non trouvé" });
    }
    res.json({ message: " Hôpital supprimé avec succès", hopital });
  } catch (err) {
    console.error(" Erreur suppression hôpital:", err);
    res.status(500).json({ error: "Erreur lors de la suppression de l'hôpital" });
  }
});


module.exports = router;