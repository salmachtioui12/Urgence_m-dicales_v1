const express = require("express");
const router = express.Router();
const Ambulance = require("../models/Ambulance");
const Hopital = require("../models/Hopital");

// GET all ambulances with hopital info
router.get('/', async (req, res) => {
  try {
    const ambulances = await Ambulance.find().populate("hopitalId");
    res.json(ambulances);
  } catch (err) {
    res.status(500).json({ error: "Erreur MongoDB" });
  }
});

// PUT /api/ambulances/:id/etat
router.put("/:id/etat", async (req, res) => {
  const { id } = req.params;
  const { etat } = req.body;

  try {
    const ambulance = await Ambulance.findByIdAndUpdate(id, { etat }, { new: true });
    res.json(ambulance);
  } catch (err) {
    res.status(500).json({ error: "Erreur mise à jour état" });
  }
});

module.exports = router;
