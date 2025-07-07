
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icônes personnalisées
const iconShadow = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";

const iconEnAttente = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconEnCours = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconTermine = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const agentIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const hopitalIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});



function Cart() {
  const [appels, setAppels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [hopitaux, setHopitaux] = useState([]);

const center = { lat: 33.5731, lng: -7.5898 }; // 📍 Casablanca

  const fetchData = async () => {
    const appelsRes = await fetch("http://localhost:3000/appels");
    const agentsRes = await fetch("http://localhost:3000/agents");
    setAppels(await appelsRes.json());
    setAgents(await agentsRes.json());
  };

  const fetchHopitaux = async () => {
    const res = await fetch(
      `http://localhost:3000/api/hopitaux?lat=${center.lat}&lng=${center.lng}&radius=5000`
    );
    setHopitaux(await res.json());
  };

  const changerStatut = async (id, statutActuel) => {
    const nouveauStatut =
      statutActuel === "en attente" ? "en cours" : statutActuel === "en cours" ? "terminé" : "en attente";

    await fetch(`http://localhost:3000/appels/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nouveauStatut }),
    });
    fetchData();
  };

  useEffect(() => {
    fetchData();
    fetchHopitaux();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Appels */}
        {appels.map(appel => (
          <Marker
            key={appel.id}
            position={[appel.position.lat, appel.position.lng]}
            icon={
              appel.status === "en cours"
                ? iconEnCours
                : appel.status === "terminé"
                ? iconTermine
                : iconEnAttente
            }
          >
            <Popup>
              <strong>{appel.description}</strong>
              <br />
              Statut : {appel.status}
              <br />
              <button onClick={() => changerStatut(appel.id, appel.status)}>Changer statut</button>
            </Popup>
          </Marker>
        ))}

        {/* Agents */}
        {agents.map(agent => (
          <Marker key={agent.id} position={[agent.position.lat, agent.position.lng]} icon={agentIcon}>
            <Popup>
              <strong>{agent.nom}</strong>
              <br />Position actuelle
            </Popup>
          </Marker>
        ))}

        {/* Hôpitaux */}
        {hopitaux.map(h => (
          <Marker key={h.id} position={[h.position.lat, h.position.lng]} icon={hopitalIcon}>
           
            <Popup>
  <strong>{h.nom}</strong>
  <br />
  {h.adresse}
  <br />
  {h.nombreAmbulances !== null ? `Ambulances : ${h.nombreAmbulances}` : "Nombre d'ambulances inconnu"}
</Popup>

          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Cart;
