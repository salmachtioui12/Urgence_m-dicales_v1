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
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function Cart() {
  const [appels, setAppels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [hopitaux, setHopitaux] = useState([]);

  // État pour savoir si la génération automatique des appels est activée
  const [autoAppelsActifs, setAutoAppelsActifs] = useState(false);

  const center = { lat: 33.5731, lng: -7.5898 }; // Casablanca

  const fetchData = async () => {
    try {
      const appelsRes = await fetch("http://localhost:3000/appels");
      const agentsRes = await fetch("http://localhost:3000/agents");
      setAppels(await appelsRes.json());
      setAgents(await agentsRes.json());
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  const fetchHopitaux = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/hopitaux?lat=${center.lat}&lng=${center.lng}&radius=5000`
      );
      setHopitaux(await res.json());
    } catch (error) {
      console.error("Erreur lors de la récupération des hôpitaux :", error);
    }
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

  const demarrerAppelsAuto = async () => {
    await fetch("http://localhost:3000/appels/start", { method: "POST" });
    setAutoAppelsActifs(true);
    console.log("▶️ Génération automatique d'appels démarrée (backend)");
  };

  const arreterAppelsAuto = async () => {
    await fetch("http://localhost:3000/appels/stop", { method: "POST" });
    setAutoAppelsActifs(false);
    console.log("⛔ Génération automatique d'appels arrêtée (backend)");
  };

  useEffect(() => {
    fetchData();
    fetchHopitaux();

    const interval = setInterval(fetchData, 5000); // Met à jour la carte toutes les 5 secondes

    return () => clearInterval(interval); // Nettoyage à la sortie du composant
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      {/* Boutons de contrôle */}
      <div style={{ padding: "10px", textAlign: "center", backgroundColor: "#f9f9f9" }}>
        <button
          onClick={arreterAppelsAuto}
          style={{
            marginRight: "15px",
            padding: "12px 20px",
            backgroundColor: autoAppelsActifs ? "#f8d7da" : "#c0392b",
            color: autoAppelsActifs ? "#721c24" : "#fff",
            border: "none",
            borderRadius: "18px",
            cursor: autoAppelsActifs ? "pointer" : "not-allowed",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            transition: "0.3s ease",
          }}
          disabled={!autoAppelsActifs}
          onMouseOver={(e) => {
            if (autoAppelsActifs) e.currentTarget.style.backgroundColor = "#c0392b";
          }}
          onMouseOut={(e) => {
            if (autoAppelsActifs) e.currentTarget.style.backgroundColor = "#f8d7da";
          }}
        >
          ⛔ Arrêter les appels automatiques
        </button>

        <button
          onClick={demarrerAppelsAuto}
          style={{
            padding: "12px 20px",
            backgroundColor: autoAppelsActifs ? "#1e8449" : "#d4edda",
            color: autoAppelsActifs ? "#fff" : "#155724",
            border: "none",
            borderRadius: "18px",
            cursor: autoAppelsActifs ? "not-allowed" : "pointer",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            transition: "0.3s ease",
          }}
          disabled={autoAppelsActifs}
          onMouseOver={(e) => {
            if (!autoAppelsActifs) e.currentTarget.style.backgroundColor = "#1e8449";
          }}
          onMouseOut={(e) => {
            if (!autoAppelsActifs) e.currentTarget.style.backgroundColor = "#d4edda";
          }}
        >
          ▶️ Relancer les appels automatiques
        </button>
      </div>

      {/* Carte Leaflet */}
      <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Appels */}
        {appels.map((appel) => {
  // Choix de l'icône selon l'état
  let icon;
  if (appel.etat === "en intervention") icon = iconEnCours;
  else if (appel.etat === "terminé") icon = iconTermine;
  else icon = iconEnAttente;

  // Couleur gravité
  const graviteColor =
    appel.gravite === "critique" ? "#e74c3c" : // rouge vif
    appel.gravite === "moyenne" ? "#e67e22" : // orange
    "#27ae60"; // vert

  return (
    <Marker key={appel.id} position={[appel.position.lat, appel.position.lng]} icon={icon}>
    
     <Popup>
  <div style={{ fontFamily: "Arial", fontSize: "14px", lineHeight: "1.6", color: "#333" }}>
    <strong style={{ fontSize: "16px", color: "#2c3e50" }}>{appel.patientName}</strong> <br />
    <em style={{ color: "#7f8c8d" }}>{appel.description}</em> <br />
    <span><strong>📍 Localisation :</strong> {appel.localisation}</span><br />
    <span><strong>⏰ Heure :</strong> {new Date(appel.heureAppel).toLocaleTimeString()}</span><br />
    <span><strong>🔥 Gravité :</strong>{" "}
      <span style={{ color: graviteColor, fontWeight: "bold" }}>{appel.gravite}</span>
    </span><br />
    <span><strong>🚑 Ambulance :</strong> {appel.ambulanceAffectee ?? "Aucune"}</span><br />
    <span><strong>📡 État :</strong> {appel.etat}</span><br />
   <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
  <button
    onClick={() => changerStatut(appel.id, appel.etat)}
    style={{
      padding: "6px 14px",
      backgroundColor: "#2980b9",
      color: "#fff",
      border: "none",
      borderRadius: "18px",
      cursor: "pointer",
    }}
  >
    🔄 Changer état
  </button>
</div>

  </div>
</Popup>

    </Marker>
  );
})}


        {/* Agents */}
        {agents.map((agent) => (
          <Marker key={agent.id} position={[agent.position.lat, agent.position.lng]} icon={agentIcon}>
            <Popup>
              <strong>{agent.nom}</strong>
              <br />
              Position actuelle
            </Popup>
          </Marker>
        ))}

        {/* Hôpitaux */}
        {hopitaux
          .filter((h) => h.nom && h.adresse)
          .map((h) => (
            <Marker key={h.id} position={[h.position.lat, h.position.lng]} icon={hopitalIcon}>
              <Popup>
                <strong>{h.nom}</strong>
                <br />
                {h.adresse}
                <br />
                {h.nombreAmbulances !== null
                  ? `Ambulances : ${h.nombreAmbulances}`
                  : "Nombre d'ambulances inconnu"}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

export default Cart;
