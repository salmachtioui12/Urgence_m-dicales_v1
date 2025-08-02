const express = require('express');
const router = express.Router();
const Ambulancier = require('../models/Ambulancier');

// 🔐 Middleware JWT si tu veux protéger cette route
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: "Token manquant" });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Token manquant" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token invalide" });
    req.user = decoded;
    next();
  });
}

// 📌 GET profil ambulancier via email (protégé ou non selon ton besoin)
router.get('/profil/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const profil = await Ambulancier.findOne({ email });

    if (!profil) {
      return res.status(404).json({ message: "Profil ambulancier introuvable" });
    }

    res.json(profil);
  } catch (err) {
    console.error("Erreur récupération profil ambulancier:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération du profil." });
  }
});
// PATCH mise à jour du profil ambulancier
router.patch('/profil/:email', async (req, res) => {
  const email = req.params.email;
  const updates = req.body;

  try {
    const updated = await Ambulancier.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Profil non trouvé pour mise à jour" });
    }

    res.json({ message: "Profil mis à jour", data: updated });
  } catch (err) {
    console.error("Erreur update ambulancier:", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
});

module.exports = router;
