import React, { useEffect, useState } from "react";
import { FaHospitalSymbol, FaMapMarkerAlt } from "react-icons/fa";
import { MdDepartureBoard, MdLocationOn } from "react-icons/md";
import './ListeAmbulances.css';


export default function ListeAmbulances() {
  const [ambulances, setAmbulances] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filtre, setFiltre] = useState({ type: "", etat: "", hopital: "" });

  useEffect(() => {
    fetch("http://localhost:3000/api/ambulances")
      .then((res) => res.json())
      .then((data) => {
        setAmbulances(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Erreur fetch ambulances:", err));
  }, []);

  useEffect(() => {
    const resultats = ambulances.filter((amb) => {
      const matchType = !filtre.type || amb.type === filtre.type;
      const matchEtat = !filtre.etat || amb.etat === filtre.etat;
      const matchHopital =
        !filtre.hopital ||
        amb.hopitalId?.nom?.toLowerCase().includes(filtre.hopital.toLowerCase());
      return matchType && matchEtat && matchHopital;
    });
    setFiltered(resultats);
  }, [filtre, ambulances]);

  return (
    <div className="liste-container">
  <h2 className="liste-title">Liste des Ambulances</h2>

  <div className="filtres">
    <select
      value={filtre.type}
      onChange={(e) => setFiltre({ ...filtre, type: e.target.value })}
    >
      <option value="">Type (tous)</option>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
    </select>

    <select
      value={filtre.etat}
      onChange={(e) => setFiltre({ ...filtre, etat: e.target.value })}
    >
      <option value="">État (tous)</option>
      <option value="disponible">Disponible</option>
      <option value="en mission">En mission</option>
      <option value="maintenance">En maintenance</option>
    </select>

    <input
      type="text"
      placeholder="🔍 Hôpital..."
      value={filtre.hopital}
      onChange={(e) => setFiltre({ ...filtre, hopital: e.target.value })}
    />
  </div>

  {filtered.length === 0 ? (
    <div className="no-results">Aucune ambulance ne correspond aux critères</div>
  ) : (
    <div className="ambulance-grid">
      {filtered.map((amb) => (
        <div
          key={amb._id}
          className={`ambulance-card ${
            amb.etat === "disponible"
              ? "card-border-disponible"
              : amb.etat === "en mission"
              ? "card-border-mission"
              : "card-border-maintenance"
          }`}
        >
          <div className="card-header">
            <strong>Ambulance #{amb.id}</strong>
            <span
              className={`etat-label ${
                amb.etat === "disponible"
                  ? "etat-disponible"
                  : amb.etat === "en mission"
                  ? "etat-mission"
                  : "etat-maintenance"
              }`}
            >
              {amb.etat}
            </span>
          </div>

          <div className="card-type">
            <span>Type: </span>
            <span>{amb.type}</span>
          </div>

          <div className="zone">
            <div className="zone-top">
              <MdDepartureBoard />
              <span>06.05.2023 8:00 AM</span>
            </div>
            <div style={{ fontWeight: 500 }}>123 Main St, Anytown</div>
          </div>

          {amb.etat === "en mission" && amb.destination && (
            <div className="zone">
              <div className="zone-top">
                <FaMapMarkerAlt />
                <span>Destination</span>
              </div>
              <div style={{ fontWeight: 500 }}>{amb.destination}</div>
            </div>
          )}

          <div className="card-footer">
            <div>
              <FaHospitalSymbol /> <strong>Affectée à:</strong> {amb.hopitalId?.nom || "Non affectée"}
            </div>
            <div>
              <MdLocationOn /> <strong>Position:</strong>{" "}
              {amb.position ? `${amb.position.lat.toFixed(3)}, ${amb.position.lng.toFixed(3)}` : "Inconnue"}
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
}
