const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET || 'votre_clé_secrète_jwt';

exports.register = async (req, res) => {
  try {
    const { nom, email, password, role, details } = req.body;

    if (!nom || !email || !password || !role) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      nom,
      email,
      password: hashedPassword,
      role,
      details
    });

    await user.save();

    const message = role === 'ambulancier'
      ? "Votre demande a été envoyée à l'hôpital pour approbation."
      : "Compte créé avec succès.";

    res.status(201).json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    // 🔐 Empêche connexion si le compte ambulancier est en attente ou rejeté
    if (user.role === 'ambulancier' && user.status !== 'approuve') {
      return res.status(403).json({
        message: user.status === 'en_attente'
          ? "Votre compte est en attente d'approbation."
          : "Votre demande d'inscription a été rejetée."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user._id, role: user.role, nom: user.nom },
      SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
