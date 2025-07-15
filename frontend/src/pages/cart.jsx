/*import React, { useEffect, useState } from "react";
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

     
      <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

       
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


        {agents.map((agent) => (
          <Marker key={agent.id} position={[agent.position.lat, agent.position.lng]} icon={agentIcon}>
            <Popup>
              <strong>{agent.nom}</strong>
              <br />
              Position actuelle
            </Popup>
          </Marker>
        ))}

      
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

export default Cart;*/
/*import React, { useEffect, useState } from "react";
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

// Fonction utilitaire pour les styles de boutons
const boutonStyle = (color) => ({
  margin: "5px",
  padding: "10px 16px",
  backgroundColor: color,
  color: "#fff",
  border: "none",
  borderRadius: "18px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
});

function Cart() {
  const [appels, setAppels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [hopitaux, setHopitaux] = useState([]);
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
      statutActuel === "en attente" ? "en intervention" : statutActuel === "en intervention" ? "terminé" : "en attente";

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
  };

  const arreterAppelsAuto = async () => {
    await fetch("http://localhost:3000/appels/stop", { method: "POST" });
    setAutoAppelsActifs(false);
  };

  const resetAppels = async () => {
    await fetch("http://localhost:3000/appels/reset", { method: "DELETE" });
    fetchData();
  };

  const appelCritique = async () => {
    await fetch("http://localhost:3000/appels/force-critique", { method: "POST" });
    fetchData();
  };

  const testSurcharge = async () => {
    await fetch("http://localhost:3000/appels/surcharge", { method: "POST" });
  };

  useEffect(() => {
    fetchData();
    fetchHopitaux();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: "100vh" }}>
  
      <div style={{ padding: "10px", textAlign: "center", backgroundColor: "#f9f9f9" }}>
        <button onClick={arreterAppelsAuto} disabled={!autoAppelsActifs} style={boutonStyle("#c0392b")}>
          ⛔ Arrêter les appels automatiques
        </button>
        <button onClick={demarrerAppelsAuto} disabled={autoAppelsActifs} style={boutonStyle("#1e8449")}>
          ▶️ Relancer les appels automatiques
        </button>
        <button onClick={resetAppels} style={boutonStyle("red")}>
          ♻️ Réinitialiser la simulation
        </button>
        <button onClick={appelCritique} style={boutonStyle("orange")}>
          🚨 Forcer un appel critique
        </button>
        <button onClick={testSurcharge} style={boutonStyle("purple")}>
          ⚡ Test de surcharge
        </button>
      </div>

    
      <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {appels.map((appel) => {
          let icon = iconEnAttente;
          if (appel.etat === "en intervention") icon = iconEnCours;
          else if (appel.etat === "terminé") icon = iconTermine;

          const graviteColor =
            appel.gravite === "critique"
              ? "#e74c3c"
              : appel.gravite === "moyenne"
              ? "#e67e22"
              : "#27ae60";

          return (
            <Marker key={appel._id} position={[appel.position.lat, appel.position.lng]} icon={icon}>
              <Popup>
                <div style={{ fontFamily: "Arial", fontSize: "14px", lineHeight: "1.6", color: "#333" }}>
                  <strong style={{ fontSize: "16px", color: "#2c3e50" }}>{appel.patientName}</strong>
                  <br />
                  <em style={{ color: "#7f8c8d" }}>{appel.description}</em>
                  <br />
                  <span><strong>📍 Localisation :</strong> {appel.localisation}</span><br />
                  <span><strong>⏰ Heure :</strong> {new Date(appel.heureAppel).toLocaleTimeString()}</span><br />
                  <span><strong>🔥 Gravité :</strong>{" "}
                    <span style={{ color: graviteColor, fontWeight: "bold" }}>{appel.gravite}</span>
                  </span><br />
                  <span><strong>🚑 Ambulance :</strong> {appel.ambulanceAffectee ?? "Aucune"}</span><br />
                  <span><strong>📡 État :</strong> {appel.etat}</span><br />
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <button
                      onClick={() => changerStatut(appel._id, appel.etat)}
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

        
        {agents.map((agent) => (
          <Marker key={agent.id} position={[agent.position.lat, agent.position.lng]} icon={agentIcon}>
            <Popup>
              <strong>{agent.nom}</strong>
              <br />
              Position actuelle
            </Popup>
          </Marker>
        ))}

        
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

export default Cart;*/
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Notification from "../components/Notification";
import FormulaireAppelManuel from "./FormulaireAppelManuel";

const ambulanceTypeNames = {
  A: "Ambulance de type A (transport non urgent)",
  B: "Ambulance de type B (soins d'urgence de base)",
  C: "Ambulance de type C (réanimation et soins intensifs)",
};

// Fonction pour compter les ambulances par type
function countAmbulancesByType(ambulances) {
  return ambulances.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});
}

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
  const [autoAppelsActifs, setAutoAppelsActifs] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({});

  const center = { lat: 33.5731, lng: -7.5898 }; // Casablanca

  const showNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const showConfirm = (message, onConfirm) => {
    setDialogConfig({
      message,
      onConfirm: () => {
        onConfirm();
        setShowConfirmDialog(false);
      }
    });
    setShowConfirmDialog(true);
  };

  const fetchData = async () => {
    try {
      const appelsRes = await fetch("http://localhost:3000/appels");
      const agentsRes = await fetch("http://localhost:3000/agents");
      setAppels(await appelsRes.json());
      setAgents(await agentsRes.json());
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      showNotification("Erreur lors de la récupération des données", "error");
    }
  };

  const fetchHopitaux = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/hopitaux?lat=${center.lat}&lng=${center.lng}&radius=15000`
      );
      setHopitaux(await res.json());
    } catch (error) {
      console.error("Erreur lors de la récupération des hôpitaux :", error);
      showNotification("Erreur lors de la récupération des hôpitaux", "error");
    }
  };

  const changerStatut = async (id, statutActuel) => {
    try {
      const nouveauStatut =
        statutActuel === "en attente" ? "en intervention" : statutActuel === "en intervention" ? "terminée" : "en attente";

      await fetch(`http://localhost:3000/appels/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nouveauStatut }),
      });

      fetchData();
      showNotification(`Statut changé à: ${nouveauStatut}`, "success");
    } catch (error) {
      console.error("Erreur lors du changement de statut :", error);
      showNotification("Erreur lors du changement de statut", "error");
    }
  };

  const demarrerAppelsAuto = async () => {
    try {
      await fetch("http://localhost:3000/appels/start", { method: "POST" });
      setAutoAppelsActifs(true);
      showNotification("Génération automatique d'appels démarrée", "success");
    } catch (error) {
      console.error("Erreur lors du démarrage des appels auto :", error);
      showNotification("Erreur lors du démarrage des appels auto", "error");
    }
  };

  const arreterAppelsAuto = async () => {
    try {
      await fetch("http://localhost:3000/appels/stop", { method: "POST" });
      setAutoAppelsActifs(false);
      showNotification("Génération automatique d'appels arrêtée", "warning");
    } catch (error) {
      console.error("Erreur lors de l'arrêt des appels auto :", error);
      showNotification("Erreur lors de l'arrêt des appels auto", "error");
    }
  };

  const creerAppelManuel = async (data) => {
    try {
      const appelData = {
        ...data,
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng),
      };

      await fetch("http://localhost:3000/appels/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appelData),
      });

      fetchData();
      setShowForm(false);
      showNotification("Appel manuel créé avec succès", "success");
    } catch (error) {
      console.error("Erreur lors de la création de l'appel manuel :", error);
      showNotification("Erreur lors de la création de l'appel manuel", "error");
    }
  };

  const resetSimulation = async () => {
    try {
      await fetch("http://localhost:3000/appels/reset", { method: "DELETE" });
      await fetchData();
      showNotification("Tous les appels ont été supprimés", "success");
    } catch (error) {
      console.error("Erreur lors de la réinitialisation :", error);
      showNotification("Erreur lors de la réinitialisation", "error");
    }
  };

  useEffect(() => {
    fetchData();
    fetchHopitaux();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>

      {/* Boîte de dialogue de confirmation */}
      {showConfirmDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "20px",
              width: "350px",
              maxWidth: "90%",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              animation: "fadeInScale 0.3s forwards",
            }}
          >
            <div
              style={{ marginBottom: "20px", fontSize: "16px", color: "#333", textAlign: "center" }}
            >
              {dialogConfig.message}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
              <button
                onClick={() => setShowConfirmDialog(false)}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  backgroundColor: "#ecf0f1",
                  color: "#7f8c8d",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#bdc3c7")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ecf0f1")}
              >
                Annuler
              </button>
              <button
                onClick={dialogConfig.onConfirm}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c0392b")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#e74c3c")}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boutons de contrôle */}
      <div style={{ padding: "10px", textAlign: "center", backgroundColor: "#f9f9f9" }}>
        {/* Contrôle auto */}
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
          }}
          disabled={!autoAppelsActifs}
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
          }}
          disabled={autoAppelsActifs}
        >
          ▶️ Relancer les appels automatiques
        </button>

        {/* Boutons de test */}
        <button
          onClick={() => setShowForm(true)}
          style={{
            margin: "10px",
            padding: "10px 20px",
            backgroundColor: "rgba(41, 128, 185, 0.6)",
            color: "white",
            border: "none",
            borderRadius: "18px",
          }}
        >
          ➕ Créer un appel manuel
        </button>

        <button
          onClick={() => showConfirm("Êtes-vous sûr de vouloir tout réinitialiser ?", resetSimulation)}
          style={{
            margin: "10px",
            padding: "10px 20px",
            backgroundColor: "rgba(127, 140, 141, 0.6)",
            color: "white",
            border: "none",
            borderRadius: "18px",
          }}
        >
          🧹 Réinitialiser la simulation
        </button>

        <button
          onClick={async () => {
            try {
              await fetch("http://localhost:3000/appels/surcharge", { method: "POST" });
              await fetchData();
              showNotification("10 appels critiques générés", "warning");
            } catch (error) {
              console.error("Erreur lors de la génération de surcharge :", error);
              showNotification("Erreur lors de la génération de surcharge", "error");
            }
          }}
          style={{
            margin: "10px",
            padding: "10px 20px",
            backgroundColor: "rgba(192, 57, 43, 0.6)",
            color: "white",
            border: "none",
            borderRadius: "18px",
          }}
        >
          ⚠️ Test surcharge (10 appels critiques)
        </button>
      </div>

      {/* Carte */}
      <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marqueurs Appels */}
        {appels.map((appel) => {
          let icon;
          if (appel.etat === "en intervention") icon = iconEnCours;
          else if (appel.etat === "terminée") icon = iconTermine;
          else icon = iconEnAttente;

          const graviteColor =
            appel.gravite === "critique" ? "#e74c3c" : appel.gravite === "moyenne" ? "#e67e22" : "#27ae60";

          return (
            <Marker key={appel._id} position={[appel.position.lat, appel.position.lng]} icon={icon}>
              <Popup>
                <div style={{ fontFamily: "Arial", fontSize: "14px", lineHeight: "1.6", color: "#333" }}>
                  <strong style={{ fontSize: "16px", color: "#2c3e50" }}>{appel.patientName}</strong> <br />
                  <em style={{ color: "#7f8c8d" }}>{appel.description}</em> <br />
                  <span>
                    <strong>📍 Localisation :</strong> {appel.localisation}
                  </span>
                  <br />
                  <span>
                    <strong>⏰ Heure :</strong> {new Date(appel.heureAppel).toLocaleTimeString()}
                  </span>
                  <br />
                  <span>
                    <strong>🔥 Gravité :</strong>{" "}
                    <span style={{ color: graviteColor, fontWeight: "bold" }}>{appel.gravite}</span>
                  </span>
                  <br />
                  <span>
                    <strong>🚑 Ambulance :</strong> {appel.ambulanceAffectee ?? "Aucune"}
                  </span>
                  <br />
                  <span>
                    <strong>📡 État :</strong> {appel.etat}
                  </span>
                  <br />
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                    <button
                      onClick={() => changerStatut(appel._id, appel.etat)}
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

        {/* Marqueurs Agents */}
        {agents.map((agent) => (
          <Marker key={agent.id} position={[agent.position.lat, agent.position.lng]} icon={agentIcon}>
            <Popup>
              <strong>{agent.nom}</strong>
              <br />
              Position actuelle
            </Popup>
          </Marker>
        ))}

        {/* Marqueurs Hôpitaux */}
        {hopitaux
          .filter((h) => h.nom && h.adresse)
          .map((h) => (
            <Marker key={h.id || h._id} position={[h.position.lat, h.position.lng]} icon={hopitalIcon}>
              <Popup>
                <div style={{ fontFamily: "Arial", fontSize: "14px", lineHeight: "1.6", color: "#333" }}>
                  <strong style={{ fontSize: "16px", color: "#2c3e50" }}>{h.nom}</strong>
                  <br />
                  {h.adresse}
                  <br />
                  <span>
  <strong>🚑 Ambulances :</strong> {Array.isArray(h.ambulances) ? h.ambulances.length : 0}
</span>

                  <br />
                  {Array.isArray(h.ambulances) && h.ambulances.length > 0 && (
                    <div>
                      <strong>Types d’ambulances disponibles :</strong>
                      <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                        {Object.entries(countAmbulancesByType(h.ambulances)).map(([type, count]) => (
                          <li key={type} style={{ listStyleType: "circle" }}>
                            {count} × {ambulanceTypeNames[type] || `Type ${type}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Formulaire d'appel manuel */}
      {showForm && <FormulaireAppelManuel onSubmit={creerAppelManuel} onClose={() => setShowForm(false)} />}
    </div>
  );
}

export default Cart;
