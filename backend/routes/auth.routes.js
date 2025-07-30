const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET || 'votre_clef_secrete';

// Middleware pour vérifier token JWT
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

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { nom, email, password, role, details } = req.body;

    if (!nom || !email || !password || !role) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }

    // Validation détails selon rôle
    if (role === 'hopital') {
      const { adresse, nombreAmbulances, responsable, telephone } = details || {};
      if (!adresse || !nombreAmbulances || !responsable || !telephone) {
        return res.status(400).json({ message: 'Champs détails hôpital obligatoires manquants' });
      }
    } else if (role === 'ambulancier') {
      const { hopitalNom, numeroAmbulance, telephone } = details || {};
      if (!hopitalNom || !numeroAmbulance || !telephone) {
        return res.status(400).json({ message: 'Champs détails ambulancier obligatoires manquants' });
      }
    } else {
      return res.status(400).json({ message: "Rôle invalide" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      nom,
      email,
      password: hashedPassword,
      role,
      details,
      status: role === 'ambulancier' ? 'en_attente' : 'approuve'
    });

    await user.save();

    const msg = role === 'ambulancier'
      ? "Demande envoyée à l'hôpital. Veuillez attendre la validation."
      : "Utilisateur créé avec succès";

    res.status(201).json({ message: msg });
  } catch (error) {
    console.error("Erreur inscription:", error);
    res.status(500).json({ message: 'Erreur serveur lors de l’inscription.' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    if (user.role === 'ambulancier' && user.status === 'en_attente') {
      return res.status(403).json({ message: "Votre compte est en attente de validation par un hôpital." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, nom: user.nom },
      SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        nom: user.nom,
        role: user.role,
        email: user.email,
        status: user.status,
        details: user.details,
      }
    });
  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
});

// Récupérer ambulanciers en attente pour un hôpital donné (route protégée)
router.get('/demandes/ambulanciers/:hopitalNom', verifyToken, async (req, res) => {
  const { hopitalNom } = req.params;
  console.log("Requête ambulanciers pour hôpital:", hopitalNom);

  try {
    const ambulanciers = await User.find({
      role: 'ambulancier',
      status: 'en_attente',
      'details.hopitalNom': hopitalNom
    });

    console.log("Ambulanciers trouvés:", ambulanciers.length);
    res.json(ambulanciers);
  } catch (err) {
    console.error("Erreur récupération ambulanciers:", err);
    res.status(500).json({ message: 'Erreur lors de la récupération des ambulanciers.' });
  }
});

// Valider un ambulancier (protégé)
router.patch('/valider/ambulancier/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndUpdate(id, { status: 'approuve' });
    res.json({ message: 'Ambulancier validé avec succès' });
  } catch (err) {
    console.error("Erreur validation ambulancier:", err);
    res.status(500).json({ message: 'Erreur lors de la validation.' });
  }
});

// Rejeter un ambulancier (protégé)
router.patch('/rejeter/ambulancier/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndUpdate(id, { status: 'rejete' });
    res.json({ message: 'Ambulancier rejeté avec succès' });
  } catch (err) {
    console.error("Erreur rejet ambulancier:", err);
    res.status(500).json({ message: 'Erreur lors du rejet.' });
  }
});

module.exports = router;
