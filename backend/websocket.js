const WebSocket = require('ws');
let wss;

function initWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client WebSocket connecté');

    ws.on('close', () => {
      console.log('Client WebSocket déconnecté');
    });
  });
}

// Fonction pour envoyer une notification à tous
function notifierCasCritique(appel) {
  if (!wss) return;
  const payload = {
    type: 'ALERTE_CRITIQUE',
    data: appel,
  };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
}
// statistique 
function notifierStatistiques(stats) {
  if (!wss) return;

  const payload = {
    type: 'STATS_UPDATE',
    data: stats,
  };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
}
function notifierDerniersAppels(appels) {
  if (!wss) return;
  const payload = {
    type: 'DERNIERS_APPELS',
    data: appels,
  };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
}

module.exports = { initWebSocket, notifierCasCritique ,notifierStatistiques,notifierDerniersAppels};
