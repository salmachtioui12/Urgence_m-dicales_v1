import React, { useEffect, useState } from "react";
import { FaHospitalSymbol, FaMapMarkerAlt } from "react-icons/fa";
import { MdDepartureBoard, MdLocationOn } from "react-icons/md";

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

      <style jsx>{`
        .liste-container {
          max-width: 1000px;
          margin: 10px auto;
          font-family: 'Segoe UI', Arial, sans-serif;
          padding: 5px;
        }

        .liste-title {
          text-align: left;
          color: #2c3e50;
          margin: 2rem 0 3rem;
          font-size: clamp(1.8rem, 3vw, 2.2rem);
          font-weight: 700;
          position: relative;
        }
        .liste-title::after {
          content: '';
          position: absolute;
          bottom: -0.75rem;
          left: 4%;
          transform: translateX(-50%);
          width: 5rem;
          height: 0.25rem;
          background: linear-gradient(90deg, rgb(19, 11, 89), #4cc9f0);
          border-radius: 2px;
        }

        .filtres {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 15px;
          justify-content: center;
          background-color: #f1f3f5;
          padding: 10px;
          border-radius: 8px;
        }

        .filtres select,
        .filtres input {
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          flex: 1 1 200px;
          background-color: #f8f9fa;
        }

        .filtres select:focus,
        .filtres input:focus {
          outline: none;
          border-color: #4361ee;
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
        }

        .no-results {
          text-align: center;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 10px;
          color: #6c757d;
        }

        .ambulance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
        }

        .ambulance-card {
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 16px;
          background-color: #fff;
          box-shadow: 0 4px 6px rgba(186, 86, 86, 0.04);
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: transform 0.2s ease;
        }
        .ambulance-card:hover {
          transform: translateY(-3px);
        }

        .card-border-disponible {
          border-bottom: 4px solid #28a745;
        }

        .card-border-mission {
          border-bottom: 4px solid #dc3545;
        }

        .card-border-maintenance {
          border-bottom: 4px solid #ffc107;
        }

        .card-header {
          display: flex;
          color: #4c545d;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          font-weight: 600;
        }

        .etat-label {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          text-transform: capitalize;
        }

        .etat-disponible {
          background-color: #e6f4ea;
          color: #2e7d32;
        }

        .etat-mission {
          background-color: #fcebea;
          color: #c62828;
        }

        .etat-maintenance {
          background-color: #fff9e6;
          color: #b28900;
        }

        .card-type,
        .zone,
        .card-footer {
          font-size: 13px;
          color: #333;
        }

        .card-type span {
          font-weight: 500;
          background-color: #f0f0f0;
          border-radius: 4px;
          padding: 3px 6px;
        }

        .zone {
          background: #f9f9f9;
          border-radius: 6px;
          padding: 8px;
        }

        .zone-top {
          font-size: 11px;
          color: #777;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 4px;
        }

        .card-footer {
          border-top: 1px solid #eee;
          padding-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          color: #666;
        }
      `}</style>
    </div>
  );
}