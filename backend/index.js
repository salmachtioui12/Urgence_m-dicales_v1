require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { verifierEtNotifierCritiquesNonAffectes } = require('./services/notifications.service');
const { getAllStats } = require('./services/stats.service');
const { notifierStatistiques } = require('./websocket');
const { notifierDerniersAppels } = require('./websocket');
const {getDerniersAppels}=require('./services/appels.service');

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app); 

// Initialise le WebSocket ici
const { initWebSocket } = require('./websocket');
initWebSocket(server);




app.use(cors());
app.use(express.json());
const interventionsRoutes = require("./routes/interventions.routes");
// Connexion MongoDB
connectDB();

// Simulation auto
const { startAutoGeneration } = require('./services/appels.service');
const { simulerDeplacement } = require('./services/agents.service');
const ambulancesRoutes = require("./routes/ambulances.routes");
app.use("/api/ambulances", ambulancesRoutes);


//startAutoGeneration();                     //  Activer génération automatique des appels
setInterval(simulerDeplacement, 5000);     //  Mouvement des agents toutes les 5s

// Routes
app.use('/appels', require('./routes/appels.routes'));
app.use('/agents', require('./routes/agents.routes'));
app.use('/api/hopitaux', require('./routes/hopitaux.routes'));

app.use("/interventions", interventionsRoutes);
app.use('/notifications', require('./routes/notifications.routes'));
const kpiRoutes = require('./routes/kpi.routes');
app.use('/api/kpi', kpiRoutes);

// notification
// Toutes les 10 secondes par ex
setInterval(() => {
  verifierEtNotifierCritiquesNonAffectes()
    .catch(err => console.error("Erreur lors de la vérification des notifications :", err));
}, 10000);
//Notification WebSocket des stats
setInterval(async () => {
  try {
    const stats = await getAllStats();
    notifierStatistiques(stats);
  } catch (err) {
    console.error('Erreur lors de l’envoi des statistiques via WebSocket', err);
  }
}, 10000);
setInterval(async () => {
  try {
    const derniersAppels = await getDerniersAppels(); // récupère les 5 derniers appels
    notifierDerniersAppels(derniersAppels); // notifie via WebSocket
  } catch (err) {
    console.error("Erreur lors de la notification des 5 derniers appels :", err);
  }
}, 10000);

// Démarrage serveur HTTP + WebSocket
server.listen(PORT, () => {
  console.log(`✅ Serveur backend + WebSocket sur http://localhost:${PORT}`);
});

