import React, { useEffect, useState } from "react";

export default function ListeAppels() {
  const [appels, setAppels] = useState([]);
  const [filtre, setFiltre] = useState({
    gravite: "",
    etat: "",
    localisation: "",
    dateHeureMin: "", // filtre date+heure minimum
  });

  const [appelsFiltres, setAppelsFiltres] = useState([]);

  const fetchAppels = async () => {
    try {
      const res = await fetch("http://localhost:3000/appels");
      const data = await res.json();
      setAppels(data);
    } catch (err) {
      console.error("Erreur fetch appels:", err);
    }
  };

  useEffect(() => {
    fetchAppels();
  }, []);

  useEffect(() => {
    const resultats = appels.filter((appel) => {
      const matchGravite = !filtre.gravite || appel.gravite === filtre.gravite;
      const matchEtat = !filtre.etat || appel.etat === filtre.etat;
      const matchLocalisation =
        !filtre.localisation || appel.localisation.toLowerCase().includes(filtre.localisation.toLowerCase());

      const matchDateHeure =
        !filtre.dateHeureMin || new Date(appel.heureAppel) >= new Date(filtre.dateHeureMin);

      return matchGravite && matchEtat && matchLocalisation && matchDateHeure;
    });

    setAppelsFiltres(resultats);
  }, [filtre, appels]);

  // Couleurs gravité
  const graviteColors = {
    critique: "#e74c3c",
    moyenne: "#e67e22",
    faible: "#27ae60",
  };

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20, color: "#34495e" }}>📋 Liste des Appels d'Urgence</h2>

      {/* Filtres */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 30,
          justifyContent: "center",
        }}
      >
        <select
          value={filtre.gravite}
          onChange={(e) => setFiltre({ ...filtre, gravite: e.target.value })}
          style={{
            padding: "10px 15px",
            borderRadius: 8,
            border: "1.5px solid #bdc3c7",
            minWidth: 150,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          <option value="">Gravité (toutes)</option>
          <option value="critique">Critique</option>
          <option value="moyenne">Moyenne</option>
          <option value="faible">Faible</option>
        </select>

        <select
          value={filtre.etat}
          onChange={(e) => setFiltre({ ...filtre, etat: e.target.value })}
          style={{
            padding: "10px 15px",
            borderRadius: 8,
            border: "1.5px solid #bdc3c7",
            minWidth: 150,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          <option value="">État (tous)</option>
          <option value="en attente">En attente</option>
          <option value="en intervention">En intervention</option>
          <option value="terminé">Terminé</option>
        </select>

        <input
          type="text"
          placeholder="Rechercher localisation"
          value={filtre.localisation}
          onChange={(e) => setFiltre({ ...filtre, localisation: e.target.value })}
          style={{
            padding: "10px 15px",
            borderRadius: 8,
            border: "1.5px solid #bdc3c7",
            minWidth: 250,
            fontSize: 14,
          }}
        />

        <input
          type="datetime-local"
          value={filtre.dateHeureMin}
          onChange={(e) => setFiltre({ ...filtre, dateHeureMin: e.target.value })}
          style={{
            padding: "10px 15px",
            borderRadius: 8,
            border: "1.5px solid #bdc3c7",
            minWidth: 250,
            fontSize: 14,
          }}
          title="Filtrer à partir de cette date et heure"
        />
      </div>

      {/* Liste cards */}
      <div style={{ display: "grid", gap: 20 }}>
        {appelsFiltres.length === 0 ? (
          <p style={{ textAlign: "center", color: "#7f8c8d" }}>Aucun appel trouvé.</p>
        ) : (
          appelsFiltres.map((appel) => (
            <div
              key={appel._id}
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, color: "#2c3e50" }}>{appel.patientName}</h3>
                <span
                  style={{
                    backgroundColor: graviteColors[appel.gravite] + "33",
                    color: graviteColors[appel.gravite],
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontWeight: "bold",
                    fontSize: 12,
                    textTransform: "capitalize",
                    minWidth: 80,
                    textAlign: "center",
                  }}
                >
                  {appel.gravite}
                </span>
              </div>

              <p style={{ margin: "6px 0", color: "#34495e", fontStyle: "italic" }}>{appel.description}</p>

              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 14, color: "#555" }}>
                <div>
                  <strong>Localisation:</strong> {appel.localisation}
                </div>
                <div>
                  <strong>Heure:</strong> {new Date(appel.heureAppel).toLocaleString()}
                </div>
                <div>
                  <strong>État:</strong>{" "}
                  <span
                    style={{
                      color:
                        appel.etat === "en attente"
                          ? "#f39c12"
                          : appel.etat === "en intervention"
                          ? "#2980b9"
                          : "#27ae60",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {appel.etat}
                  </span>
                </div>
                <div>
                  <strong>Ambulance:</strong> {appel.ambulanceAffectee ?? "Aucune"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
