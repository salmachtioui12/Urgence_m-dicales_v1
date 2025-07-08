require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connexion MongoDB
connectDB();

// Simulation auto
const { startAutoGeneration } = require('./services/appels.service');
const { simulerDeplacement } = require('./services/agents.service');

startAutoGeneration();                     // ✅ Activer génération automatique des appels
setInterval(simulerDeplacement, 5000);     // ✅ Mouvement des agents toutes les 5s

// Routes
app.use('/appels', require('./routes/appels.routes'));
app.use('/agents', require('./routes/agents.routes'));
app.use('/api/hopitaux', require('./routes/hopitaux.routes'));

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur backend sur http://localhost:${PORT}`);
});
