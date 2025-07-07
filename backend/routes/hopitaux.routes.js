const express = require('express');
const router = express.Router();
const Hopital = require('../models/Hopital');
const { fetchHopitauxNearby } = require('../services/hopitaux.service');

router.get('/', async (req, res) => {
  const { lat, lng, radius } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: "lat et lng requis" });

  try {
    const hopitaux = await fetchHopitauxNearby(lat, lng, radius);
    res.json(hopitaux);
  } catch (err) {
    console.error("❌ Erreur Overpass API:", err);
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

router.post('/', async (req, res) => {
  const { osmId, nom, adresse, position, nombreAmbulances } = req.body;
  try {
    const hopital = new Hopital({ osmId, nom, adresse, position, nombreAmbulances });
    await hopital.save();
    res.status(201).json(hopital);
  } catch (err) {
    res.status(500).json({ error: "Erreur enregistrement MongoDB" });
  }
});

module.exports = router;