const express = require("express");
const router = express.Router();
const Intervention = require("../models/Intervention");
const Ambulance = require("../models/Ambulance");
const Appel = require("../models/Appel");
const { updateAppelStatus } = require('../services/appels.service');
const { getAllStats } = require('../services/stats.service');
const { notifierStatistiques } = require('../websocket');
// GET /interventions/en-cours
router.get("/en-cours", async (req, res) => {
  try {
    const interventions = await Intervention.find({ statut: "en cours" })
      .populate("appelId")
      .populate("ambulanceId")
      .sort({ debutIntervention: -1 });

    res.json(interventions);
  } catch (err) {
    console.error(" Erreur récupération interventions :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// Marquer une intervention comme terminée
router.put('/:id/finish', async (req, res) => {
  try {
    const intervention = await Intervention.findById(req.params.id);
    if (!intervention) {
      return res.status(404).json({ message: "Intervention non trouvée" });
    }

    intervention.statut = 'terminée';
    intervention.finEstimee = new Date();
    await intervention.save();

    const appel = await updateAppelStatus(intervention.appelId, 'terminée');
 //  Notifier nouvelles stats après chaque appel généré
      const updatedStats = await getAllStats();
      notifierStatistiques(updatedStats);
    return res.json({ message: "Intervention et appel terminés", appel });
  } catch (error) {
    console.error("Erreur lors de la fin d'intervention :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;

