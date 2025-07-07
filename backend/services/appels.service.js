let appels = [];

function genererAppel() {
  const id = appels.length + 1;
  const appel = {
    id,
    description: `Appel simulé #${id}`,
    position: {
      lat: 33.5731 + (Math.random() - 0.5) * 0.09,
      lng: -7.5898 + (Math.random() - 0.5) * 0.09,
    },
    status: 'en attente',
    createdAt: new Date(),
  };
  appels.push(appel);
  console.log(`📞 Nouvel appel créé : ${appel.description}`);
}

function getAppels() {
  return appels;
}

function updateAppelStatus(id, status) {
  const appel = appels.find(a => a.id === id);
  if (!appel) return null;
  appel.status = status;
  return appel;
}

module.exports = { genererAppel, getAppels, updateAppelStatus };
