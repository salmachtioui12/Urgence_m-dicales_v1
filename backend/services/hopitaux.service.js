const Hopital = require('../models/Hopital');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function fetchHopitauxNearby(lat, lng, radius = 5000) {
  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      way["amenity"="hospital"](around:${radius},${lat},${lng});
      relation["amenity"="hospital"](around:${radius},${lat},${lng});
    );
    out center;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  const data = await response.json();

  return await Promise.all(data.elements
    .filter(el => (el.lat || el.center?.lat) && (el.lon || el.center?.lon))
    .map(async h => {
      const tags = h.tags || {};
      const adresse = [
        tags["addr:housenumber"],
        tags["addr:street"],
        tags["addr:postcode"],
        tags["addr:city"]
      ].filter(Boolean).join(', ');

      const position = {
        lat: h.lat || h.center?.lat,
        lng: h.lon || h.center?.lon,
      };

      const hopitalLocal = await Hopital.findOne({ osmId: h.id });

      return {
        id: h.id,
        nom: tags.name || "Hôpital inconnu",
        adresse: adresse || "Adresse inconnue",
        position,
        nombreAmbulances: hopitalLocal?.nombreAmbulances ?? null,
      };
    }));
}

module.exports = { fetchHopitauxNearby };