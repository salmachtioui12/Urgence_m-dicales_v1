const {
  getTotalUrgencesTraitees,
  getTempsMoyenReponse,
  getTauxOccupation,
  getUrgencesParZone,
  getAmbulancesDisponibles,
  getRepartitionTypeUrgences
} = require('../services/kpi.service');

async function getAllStats() {
  const [
    urgences,
    tempsReponse,
    occupation,
    urgencesZones,
    ambulances,
    repartitionUrgences
  ] = await Promise.all([
    getTotalUrgencesTraitees(),
    getTempsMoyenReponse(),
    getTauxOccupation(),
    getUrgencesParZone(),
    getAmbulancesDisponibles(),
    getRepartitionTypeUrgences()
  ]);

  return {
    urgences,
    tempsReponse,
    occupation,
    urgencesZones,
    ambulances,
    repartitionUrgences
  };
}

module.exports = { getAllStats };
