const axios = require("axios");
const Appel = require("../models/Appel");
const Ambulance = require("../models/Ambulance");
const Intervention = require("../models/Intervention");

let intervalId = null;

// --- UTILS ---
function genererGravite() {
  const r = Math.random();
  if (r < 0.2) return "critique";
  if (r < 0.6) return "moyenne";
  return "faible";
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
    const { data } = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: { lat, lon: lng, format: "json" },
      headers: { "User-Agent": "emergency-simulation-app" },
    });

    const addr = data.address;
    return (
      addr.suburb ||
      addr.neighbourhood ||
      addr.city ||
      addr.town ||
      addr.village ||
      data.display_name ||
      "Localisation inconnue"
    );
  } catch (err) {
    console.error("🌐 Erreur Nominatim:", err.message);
    return "Localisation inconnue";
  }
}

function genererNomPatient(heureAppel) {
  const timestamp = new Date(heureAppel).getTime();
  const random = Math.floor(Math.random() * 900 + 100);
  return `Patient-${timestamp}-${random}`;
}

function distance(pos1, pos2) {
  const dx = pos1.lat - pos2.lat;
  const dy = pos1.lng - pos2.lng;
  return Math.sqrt(dx * dx + dy * dy);
}

// --- GENERER UN APPEL ---
async function genererAppel(forceGravite = null) {
  try {
    const gravite = forceGravite || genererGravite();
    const position = genererPosition();
    const heureAppel = genererHeureAppel();
    const localisation = await getLocalisationFromCoords(position.lat, position.lng) || "Casablanca";
    const patientName = genererNomPatient(heureAppel);

    const appel = await Appel.create({
      description: `Appel simulé - ${gravite}`,
      patientName,
      localisation,
      heureAppel,
      gravite,
      ambulanceAffectee: null,
      etat: "en attente",
      position,
    });

    console.log(`✅ Appel sauvegardé : ${appel.description}`);
    await prioriserEtAffecterAmbulances(); // Lancement de l'affectation automatique
    return appel;
  } catch (err) {
    console.error("❌ Erreur génération appel :", err.message);
    return null;
  }
}
function typeAmbulanceAutorise(gravite) {
  if (gravite === 'critique') return ['C'];
  if (gravite === 'moyenne') return ['B', 'C'];
  return ['A', 'B', 'C'];
}
// --- AFFECTATION AUTOMATIQUE ---
async function prioriserEtAffecterAmbulances() {
  try {
    const appels = await Appel.find({ etat: "en attente" }).sort({ gravite: 1, heureAppel: 1 });

    for (const appel of appels) {
      const typesAutorises = typeAmbulanceAutorise(appel.gravite);

      const ambulancesDispo = await Ambulance.find({
        etat: "disponible",
        type: { $in: typesAutorises }
      });

      if (ambulancesDispo.length === 0) continue;

      const lockedAmb = ambulancesDispo.sort(
        (a, b) => distance(appel.position, a.position) - distance(appel.position, b.position)
      )[0];

      if (!lockedAmb) continue;

      // 🔁 Mettre à jour l’ambulance (en mission + destination)
      await Ambulance.findByIdAndUpdate(lockedAmb._id, {
        etat: "en mission",
        destination: appel.localisation,
      });

      // 📞 Mettre à jour l’appel
      await Appel.findByIdAndUpdate(appel._id, {
        etat: "en intervention",
        ambulanceAffectee: lockedAmb._id,
      });

      // 📝 Créer l’intervention
      await Intervention.create({
        appelId: appel._id,
        ambulanceId: lockedAmb._id,
        gravite: appel.gravite,
        localisation: appel.localisation,
        patientName: appel.patientName,
        debutIntervention: new Date(),
        finEstimee: new Date(Date.now() + 5 * 60000),
        statut: "en cours",
      });

      console.log(`🚑 Ambulance ${lockedAmb._id} (type ${lockedAmb.type}) affectée à l'appel ${appel._id}`);
    }
  } catch (err) {
    console.error("❌ Erreur affectation automatique:", err.message);
  }
}


// --- AUTRES FONCTIONS ---
async function getAppels() {
  return Appel.find().sort({ createdAt: -1 });
}

async function updateAppelStatus(id, newStatus) {
  const appel = await Appel.findById(id);
  if (!appel) return null;

  // Mettre à jour l’état de l’appel
  appel.etat = newStatus;
  await appel.save();

  // Si on termine l'appel
  if (newStatus === 'terminée' && appel.ambulanceAffectee) {
    // 1. Marquer l’intervention comme terminée
    await Intervention.findOneAndUpdate(
      { appelId: appel._id, statut: 'en cours' },
      {
        statut: 'terminée',
        finEstimee: new Date()
      }
    );

    // 2. Remettre l’ambulance en état "disponible"
    await Ambulance.findByIdAndUpdate(appel.ambulanceAffectee, {
      etat: 'disponible',
      destination: null
    });

    // 3. Relancer l’algorithme pour affecter à d’autres appels
    await prioriserEtAffecterAmbulances();
  }

  return appel;
}


async function affecterAmbulance(idAppel, idAmbulance) {
  return Appel.findByIdAndUpdate(idAppel, {
    ambulanceAffectee: idAmbulance,
    etat: "en intervention",
  });
}

function startAutoGeneration() {
  if (!intervalId) {
    intervalId = setInterval(() => genererAppel(), 30000 + Math.random() * 30000);
    console.log("🚀 Génération automatique d'appels démarrée");
  }
}

function stopAutoGeneration() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("⛔ Génération automatique arrêtée");
  }
}

// --- EXPORT ---
module.exports = {
  genererAppel,
  getAppels,
  updateAppelStatus,
  affecterAmbulance,
  startAutoGeneration,
  stopAutoGeneration,
  prioriserEtAffecterAmbulances,
};
