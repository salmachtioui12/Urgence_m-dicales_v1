/*import React, { useEffect, useState } from "react";

export default function ListeAmbulances() {
  const [ambulances, setAmbulances] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filtre, setFiltre] = useState({
    type: "",
    etat: "",
    hopital: "",
  });

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
        !filtre.hopital || amb.hopitalId?.nom?.toLowerCase().includes(filtre.hopital.toLowerCase());

      return matchType && matchEtat && matchHopital;
    });
    setFiltered(resultats);
  }, [filtre, ambulances]);

  return (
    <div style={{ 
      maxWidth: 800, 
      margin: "20px auto", 
      fontFamily: "'Segoe UI', Arial, sans-serif",
      padding: 20
    }}>
      <h2 style={{ 
        textAlign: "center", 
        color: "#2c3e50", 
        marginBottom: 30,
        fontSize: 24,
        fontWeight: 600
      }}>
        🚑 Gestion des Ambulances
      </h2>

     
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: 15, 
        marginBottom: 30, 
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        padding: 15,
        borderRadius: 10
      }}>
        <select
          value={filtre.type}
          onChange={(e) => setFiltre({ ...filtre, type: e.target.value })}
          style={{
            padding: "10px 15px",
            borderRadius: 6,
            border: "1px solid #ced4da",
            minWidth: 180,
            fontSize: 14,
            backgroundColor: "white"
          }}
        >
          <option value="">Type (tous)</option>
          <option value="medicalisee">Médicalisée</option>
          <option value="urgence">Urgence</option>
          <option value="transfert">Transfert</option>
          <option value="neonatale">Néonatale</option>
        </select>

        <select
          value={filtre.etat}
          onChange={(e) => setFiltre({ ...filtre, etat: e.target.value })}
          style={{
            padding: "10px 15px",
            borderRadius: 6,
            border: "1px solid #ced4da",
            minWidth: 180,
            fontSize: 14,
            backgroundColor: "white"
          }}
        >
          <option value="">État (tous)</option>
          <option value="disponible">Disponible</option>
          <option value="en mission">En mission</option>
          <option value="maintenance">En maintenance</option>
        </select>

        <input
          type="text"
          placeholder="Rechercher par hôpital..."
          value={filtre.hopital}
          onChange={(e) => setFiltre({ ...filtre, hopital: e.target.value })}
          style={{
            padding: "10px 15px",
            borderRadius: 6,
            border: "1px solid #ced4da",
            minWidth: 250,
            fontSize: 14
          }}
        />
      </div>


      {filtered.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: 40,
          backgroundColor: "#f8f9fa",
          borderRadius: 10,
          color: "#6c757d"
        }}>
          Aucune ambulance ne correspond aux critères de recherche
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: 20 
        }}>
          {filtered.map((amb) => (
            <div
              key={amb._id}
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                padding: 20,
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                backgroundColor: amb.etat === "disponible" ? "#28a745" : 
                                 amb.etat === "en mission" ? "#dc3545" : "#ffc107"
              }}></div>

              <div style={{ marginBottom: 15 }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10
                }}>
                  <h3 style={{ 
                    margin: 0, 
                    color: "#343a40",
                    fontSize: 18,
                    fontWeight: 600
                  }}>
                    Ambulance #{amb.id}
                  </h3>
                  <span style={{
                    backgroundColor: amb.etat === "disponible" ? "#d4edda" : 
                                      amb.etat === "en mission" ? "#f8d7da" : "#fff3cd",
                    color: amb.etat === "disponible" ? "#155724" : 
                           amb.etat === "en mission" ? "#721c24" : "#856404",
                    padding: "4px 12px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 500,
                    textTransform: "capitalize"
                  }}>
                    {amb.etat}
                  </span>
                </div>

                <div style={{ 
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#495057",
                  fontSize: 14,
                  marginBottom: 5
                }}>
                  <span style={{ fontWeight: 500 }}>Type:</span>
                  <span style={{
                    backgroundColor: "#e9ecef",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 13
                  }}>
                    {amb.type}
                  </span>
                </div>
              </div>

             
              <div style={{ 
                backgroundColor: "#f8f9fa",
                borderRadius: 6,
                padding: 12,
                marginBottom: 15
              }}>
                <div style={{ 
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 5
                }}>
                  <span style={{ fontSize: 12, color: "#6c757d" }}>Départ</span>
                  <span style={{ fontSize: 12, color: "#6c757d" }}>06.05.2023 8:00 AM</span>
                </div>
                <div style={{ fontWeight: 500 }}>123 Main St, Anytown, NY 12345</div>
              </div>

              <div style={{ 
                backgroundColor: "#f8f9fa",
                borderRadius: 6,
                padding: 12,
                marginBottom: 15
              }}>
                <div style={{ 
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 5
                }}>
                  <span style={{ fontSize: 12, color: "#6c757d" }}>Destination</span>
                  <span style={{ fontSize: 12, color: "#6c757d" }}>12.05.2023 12:00 AM</span>
                </div>
                <div style={{ fontWeight: 500 }}>456 Elm Ave, Springfield, IL 67890</div>
              </div>

           
              <div style={{ 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px dashed #dee2e6",
                paddingTop: 12
              }}>
                <div style={{ fontSize: 13, color: "#6c757d" }}>
                  <span style={{ fontWeight: 500 }}>Affectée à:</span> {amb.hopitalId?.nom || "Non affectée"}
                </div>
                <div style={{ fontSize: 13, color: "#6c757d" }}>
                  <span style={{ fontWeight: 500 }}>Position:</span> {amb.position ? `${amb.position.lat.toFixed(4)}, ${amb.position.lng.toFixed(4)}` : "Inconnue"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}*/
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
    <div style={{ maxWidth: 1000, margin: "10px auto", fontFamily: "'Segoe UI', Arial, sans-serif", padding: 5 }}>
      <h2 style={{ textAlign: "center", color: "#2c3e50", marginBottom: 15, fontSize: 20, fontWeight: 600 }}>
        🚑 Liste des Ambulances
      </h2>

      <div style={{
        display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 15,
        justifyContent: "center", backgroundColor: "#f1f3f5", padding: 10, borderRadius: 8
      }}>
        <select value={filtre.type} onChange={(e) => setFiltre({ ...filtre, type: e.target.value })}
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc", minWidth: 140, fontSize: 12 }}>
          <option value="">Type (tous)</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        
        </select>

        <select value={filtre.etat} onChange={(e) => setFiltre({ ...filtre, etat: e.target.value })}
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc", minWidth: 140, fontSize: 12 }}>
          <option value="">État (tous)</option>
          <option value="disponible">Disponible</option>
          <option value="en mission">En mission</option>
          <option value="maintenance">En maintenance</option>
        </select>

        <input type="text" placeholder="🔍 Hôpital..." value={filtre.hopital}
          onChange={(e) => setFiltre({ ...filtre, hopital: e.target.value })}
          style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc", minWidth: 180, fontSize: 12 }} />
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 20, backgroundColor: "#f8f9fa", borderRadius: 10, color: "#6c757d" }}>
          Aucune ambulance ne correspond aux critères
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {filtered.map((amb) => (
            <div key={amb._id} style={{
              border: "1px solid #dee2e6", borderRadius: 10, padding: 10,
              backgroundColor: "#ffffff", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", fontSize: 12
            }}>
              <div style={{
                borderBottom: `4px solid ${
                  amb.etat === "disponible"
                    ? "#28a745"
                    : amb.etat === "en mission"
                    ? "#dc3545"
                    : "#ffc107"
                }`,
                marginBottom: 8
              }} />

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <strong style={{ color: "#343a40" }}>Amb #{amb.id}</strong>
                <span style={{
                  padding: "3px 8px", borderRadius: 10,
                  backgroundColor:
                    amb.etat === "disponible"
                      ? "#d4edda"
                      : amb.etat === "en mission"
                      ? "#f8d7da"
                      : "#fff3cd",
                  color:
                    amb.etat === "disponible"
                      ? "#155724"
                      : amb.etat === "en mission"
                      ? "#721c24"
                      : "#856404",
                  fontWeight: 500
                }}>{amb.etat}</span>
              </div>

              <div style={{ marginBottom: 6 }}>
                <span style={{ color: "#6c757d" }}>Type:</span>{" "}
                <span style={{ backgroundColor: "#f1f3f5", padding: "2px 6px", borderRadius: 4 }}>{amb.type}</span>
              </div>

              {/* Zone départ */}
              <div style={{ backgroundColor: "#f8f9fa", borderRadius: 6, padding: 6, marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#6c757d", fontSize: 11 }}>
                  <MdDepartureBoard /> <span>06.05.2023 8:00 AM</span>
                </div>
                <div style={{ fontWeight: 500 }}>123 Main St, Anytown</div>
              </div>

             {amb.etat === "en mission" && amb.destination && (
  <div style={{ backgroundColor: "#f8f9fa", borderRadius: 6, padding: 6, marginBottom: 6 }}>
    <div style={{ display: "flex", justifyContent: "space-between", color: "#6c757d", fontSize: 11 }}>
      <FaMapMarkerAlt /> <span>Destination</span>
    </div>
    <div style={{ fontWeight: 500 }}>{amb.destination}</div>
  </div>
)}

              <div style={{ borderTop: "1px dashed #dee2e6", paddingTop: 6, color: "#6c757d" }}>
                <div><FaHospitalSymbol /> {" "}<strong>Affectée à:</strong> {amb.hopitalId?.nom || "Non affectée"}</div>
                <div>
                  <MdLocationOn />{" "}
                  <strong>Position:</strong>{" "}
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
