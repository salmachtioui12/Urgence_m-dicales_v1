import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ appels, agents, hopitaux, changerStatut, icons, center, countAmbulancesByType, ambulanceTypeNames }) => {
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marqueurs Appels */}
      {appels.map((appel) => {
        const icon = icons[appel.etat] || icons["en attente"];
        const graviteColor =
          appel.gravite === "critique" ? "#e74c3c" : appel.gravite === "moyenne" ? "#e67e22" : "#27ae60";

        return (
          <Marker key={appel._id} position={[appel.position.lat, appel.position.lng]} icon={icon}>
            <Popup>
              <div style={{ fontSize: "14px" }}>
                <strong>{appel.patientName}</strong><br />
                {appel.description}<br />
                <strong>📍</strong> {appel.localisation}<br />
                <strong>⏰</strong> {new Date(appel.heureAppel).toLocaleTimeString()}<br />
                <strong>🔥</strong> <span style={{ color: graviteColor }}>{appel.gravite}</span><br />
                <strong>🚑</strong> {appel.ambulanceAffectee || "Aucune"}<br />
                <strong>📡</strong> {appel.etat}<br />
                <button onClick={() => changerStatut(appel._id, appel.etat)}>🔄 Changer état</button>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Marqueurs Agents */}
      {agents.map((a) => (
        <Marker key={a.id} position={[a.position.lat, a.position.lng]} icon={icons.agent}>
          <Popup>
            <strong>{a.nom}</strong><br />Position actuelle
          </Popup>
        </Marker>
      ))}

      {/* Marqueurs Hôpitaux */}
      {hopitaux.map((h) => (
        <Marker key={h.id || h._id} position={[h.position.lat, h.position.lng]} icon={icons.hopital}>
          <Popup>
            <strong>{h.nom}</strong><br />
            {h.adresse}<br />
            <strong>🚑</strong> {h.nombreAmbulances ?? "inconnu"}<br />
            {Array.isArray(h.ambulances) && (
              <ul style={{ marginTop: 4 }}>
                {Object.entries(countAmbulancesByType(h.ambulances)).map(([type, count]) => (
                  <li key={type}>
                    {count} × {ambulanceTypeNames[type] || `Type ${type}`}
                  </li>
                ))}
              </ul>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
