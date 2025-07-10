import React, { useEffect, useState } from "react";

export default function ListeHopitaux() {
  const [hopitaux, setHopitaux] = useState([]);
  const [filtreNom, setFiltreNom] = useState("");
  const [position, setPosition] = useState({ lat: 33.5731, lng: -7.5898 }); // Casablanca par défaut
  const [radius, setRadius] = useState(5000);

  const fetchHopitaux = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/hopitaux?lat=${position.lat}&lng=${position.lng}&radius=${radius}`
      );
      const data = await res.json();
      setHopitaux(data);
    } catch (err) {
      console.error("Erreur fetch hopitaux:", err);
    }
  };

  useEffect(() => {
    fetchHopitaux();
  }, [position, radius]);

  const hopitauxFiltres = hopitaux.filter((h) =>
    !filtreNom || (h.nom && h.nom.toLowerCase().includes(filtreNom.toLowerCase()))
  );

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "20px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20, color: "#34495e" }}>
        🏥 Liste des Hôpitaux à proximité
      </h2>

      {/* Filtres */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Filtrer par nom"
          value={filtreNom}
          onChange={(e) => setFiltreNom(e.target.value)}
          style={{
            padding: "10px 15px",
            borderRadius: 8,
            border: "1.5px solid #bdc3c7",
            minWidth: 250,
            fontSize: 14,
          }}
        />

        <input
          type="number"
          placeholder="Rayon (mètres)"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          style={{
            padding: "10px 15px",
            borderRadius: 8,
            border: "1.5px solid #bdc3c7",
            width: 150,
            fontSize: 14,
          }}
        />
      </div>

      <div style={{ display: "grid", gap: 20 }}>
        {hopitauxFiltres.length === 0 ? (
          <p style={{ textAlign: "center", color: "#7f8c8d" }}>Aucun hôpital trouvé.</p>
        ) : (
          hopitauxFiltres.map((h) => (
            <div
              key={h.id || h._id}
              style={{
                boxShadow: "0 4px 8px rgb(0 0 0 / 0.1)",
                borderRadius: 12,
                padding: 20,
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                transition: "transform 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h3 style={{ margin: 0, color: "#2c3e50" }}>{h.nom}</h3>

              <p style={{ margin: "6px 0", color: "#34495e", fontStyle: "italic" }}>
                {h.adresse ?? "Adresse inconnue"}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 20,
                  flexWrap: "wrap",
                  fontSize: 14,
                  color: "#555",
                }}
              >
                <div>
                  <strong>Nombre d'ambulances :</strong>{" "}
                  {h.nombreAmbulances ?? "Inconnu"}
                </div>
                {Array.isArray(h.ambulances) && h.ambulances.length > 0 && (
                  <div>
                    <strong>Types d'ambulances :</strong>
                    <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                      {h.ambulances.map((a, idx) => (
                        <li key={idx} style={{ listStyleType: "circle" }}>
                          Ambulance {a.id} — Type {a.type}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
