const express = require("express");
const router = express.Router();
const Intervention = require("../models/Intervention");
const Ambulance = require("../models/Ambulance");
const Appel = require("../models/Appel");
const { updateAppelStatus } = require('../services/appels.service');

// GET /interventions/en-cours
router.get("/en-cours", async (req, res) => {
  try {
    const interventions = await Intervention.find({ statut: "en cours" })
      .populate("appelId")
      .populate("ambulanceId")
      .sort({ debutIntervention: -1 });

    res.json(interventions);
  } catch (err) {
    console.error("❌ Erreur récupération interventions :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});



// ✅ Modifier le statut d'une intervention
/* ✅ Modifier le statut d'une intervention
router.put('/:id/statut', async (req, res) => {
  const interventionId = req.params.id;
  const { statut } = req.body;

  try {
    const intervention = await Intervention.findById(interventionId);
    if (!intervention) {
      return res.status(404).json({ message: "Intervention non trouvée" });
    }

    // Mettre à jour le statut de l'intervention
    intervention.statut = statut;

    // Si l'intervention est terminée
    if (statut === "terminé") {
      // 1. Rendre l'ambulance disponible
      await Ambulance.findByIdAndUpdate(intervention.ambulanceId, {
        etat: "disponible",
        destination: null
      });

      // 2. Mettre à jour l'appel associé (état → terminé)
      await Appel.findByIdAndUpdate(intervention.appelId, {
        etat: "terminé"
      });
    }

    await intervention.save();

    res.json({ message: "Statut mis à jour", intervention });
  } catch (err) {
    console.error("Erreur mise à jour intervention :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
//
*/
// ✅ Marquer une intervention comme terminée
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

    return res.json({ message: "Intervention et appel terminés", appel });
  } catch (error) {
    console.error("Erreur lors de la fin d'intervention :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;

