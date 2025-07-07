require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connexion à la base MongoDB
connectDB();

// Lancement des simulations
const { genererAppel } = require('./services/appels.service');
const { simulerDeplacement } = require('./services/agents.service');

setInterval(genererAppel, 10000);         // simulation des appels
setInterval(simulerDeplacement, 5000);    // mouvement des agents

// Routes
app.use('/appels', require('./routes/appels.routes'));
app.use('/agents', require('./routes/agents.routes'));
app.use('/api/hopitaux', require('./routes/hopitaux.routes'));

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur backend sur http://localhost:${PORT}`);
});
