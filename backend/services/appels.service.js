const axios = require('axios');
const Appel = require('../models/Appel.js');

let intervalId = null;

function genererGravite() {
  const r = Math.random();
  if (r < 0.2) return 'critique';
  if (r < 0.6) return 'moyenne';
  return 'faible';
}

function genererHeureAppel() {
  return new Date().toISOString();
}

function genererPosition() {
  return {
    lat: 33.5731 + (Math.random() - 0.5) * 0.09,
    lng: -7.5898 + (Math.random() - 0.5) * 0.09,
  };
}

async function getLocalisationFromCoords(lat, lng) {
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon: lng,
        format: 'json',
      },
      headers: {
        'User-Agent': 'emergency-simulation-app',
      },
    });

    const addr = res.data.address;
    return (
      addr.suburb ||
      addr.neighbourhood ||
      addr.city ||
      addr.town ||
      addr.village ||
      res.data.display_name ||
      'Localisation inconnue'
    );
  } catch (err) {
    console.error('🌐 Erreur Nominatim:', err.message);
    return 'Localisation inconnue';
  }
}
function genererNomPatient(heureAppel) {
  const timestamp = new Date(heureAppel).getTime();
  const randomSuffix = Math.floor(Math.random() * 900 + 100);
  return `Patient-${timestamp}-${randomSuffix}`;
}
async function genererAppel(forceGravite = null) {
  try {
    const gravite = forceGravite || genererGravite();
    const position = genererPosition();
    const heureAppel = genererHeureAppel();
    const localisation = await getLocalisationFromCoords(position.lat, position.lng) || "Casablanca";
    const patientName = genererNomPatient(heureAppel);

    const appel = new Appel({
      description: `Appel simulé - ${gravite}`,
      patientName,
      localisation,
      heureAppel,
      gravite,
      ambulanceAffectee: null,
      etat: 'en attente',
      position,
    });

    await appel.save();
    console.log(`✅ Appel sauvegardé : ${appel.description}`);
    return appel;
  } catch (err) {
    console.error('❌ Erreur lors de la génération d\'appel :', err.message);
    return null;
  }
}



async function getAppels() {
  return await Appel.find().sort({ createdAt: -1 });
}

async function updateAppelStatus(id, status) {
  const appel = await Appel.findById(id);
  if (!appel) return null;
  appel.etat = status;
  return await appel.save();
}

async function affecterAmbulance(idAppel, idAmbulance) {
  const appel = await Appel.findById(idAppel);
  if (!appel) return null;
  appel.ambulanceAffectee = idAmbulance;
  appel.etat = 'en intervention';
  return await appel.save();
}

function startAutoGeneration() {
  if (!intervalId) {
    intervalId = setInterval(() => genererAppel(), 30000 + Math.random() * 30000);
    console.log('🚀 Génération automatique d\'appels démarrée');
  }
}

function stopAutoGeneration() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('⛔ Génération automatique arrêtée');
  }
}



const { prioriserEtAffecterAmbulances } = require('../services/appels.service');

router.post('/affectation-auto', async (req, res) => {
  await prioriserEtAffecterAmbulances();
  res.json({ message: '✅ Ambulances affectées automatiquement selon la priorité.' });
});

module.exports = {
  genererAppel,
  getAppels,
  updateAppelStatus,
  affecterAmbulance,
  startAutoGeneration,
  stopAutoGeneration,
};