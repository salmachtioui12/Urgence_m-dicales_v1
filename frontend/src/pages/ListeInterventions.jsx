import React, { useEffect, useState } from "react";
import axios from "axios";

const ListeInterventions = () => {
  const [interventions, setInterventions] = useState([]);
  const [filtreGravite, setFiltreGravite] = useState("toutes");
  const [filtreLocalisation, setFiltreLocalisation] = useState("");
  const [filtreDate, setFiltreDate] = useState(""); // format 'YYYY-MM-DD'

  const fetchInterventions = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/interventions/en-cours");
      setInterventions(data);
    } catch (err) {
      console.error("Erreur récupération :", err);
    }
  };

  const terminerIntervention = async (id) => {
    try {
      await axios.put(`http://localhost:3000/interventions/${id}/finish`, {
        statut: "terminée",
      });
      fetchInterventions(); // Refresh list
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  useEffect(() => {
    fetchInterventions();
  }, []);

  // Filtrage combiné
  const interventionsFiltrees = interventions.filter((i) => {
    // Filtre gravité
    const matchGravite = filtreGravite === "toutes" || i.gravite === filtreGravite;

    // Filtre localisation (insensible à la casse)
    const matchLocalisation =
      filtreLocalisation.trim() === "" ||
      (i.localisation && i.localisation.toLowerCase().includes(filtreLocalisation.toLowerCase()));

    // Filtre date (interventions à partir de la date choisie)
    const matchDate =
      filtreDate === "" ||
      new Date(i.debutIntervention) >= new Date(filtreDate + "T00:00:00");

    return matchGravite && matchLocalisation && matchDate;
  });

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", fontFamily: "Arial" }}>
      <h2>🚑 Interventions en cours</h2>

      {/* FILTRES */}
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          gap: 15,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Filtre Gravité */}
        <div>
          <label htmlFor="filtreGravite" style={{ marginRight: 10, fontWeight: "bold" }}>
            Gravité :
          </label>
          <select
            id="filtreGravite"
            value={filtreGravite}
            onChange={(e) => setFiltreGravite(e.target.value)}
            style={{ padding: "5px 10px", borderRadius: 4 }}
          >
            <option value="toutes">Toutes</option>
            <option value="critique">Critique</option>
            <option value="moyenne">Moyenne</option>
            <option value="faible">Faible</option>
          </select>
        </div>

        {/* Filtre Localisation */}
        <div>
          <label htmlFor="filtreLocalisation" style={{ marginRight: 10, fontWeight: "bold" }}>
            Localisation :
          </label>
          <input
            type="text"
            id="filtreLocalisation"
            placeholder="Recherche localisation"
            value={filtreLocalisation}
            onChange={(e) => setFiltreLocalisation(e.target.value)}
            style={{ padding: "5px 10px", borderRadius: 4, minWidth: 150 }}
          />
        </div>

        {/* Filtre Date */}
        <div>
          <label htmlFor="filtreDate" style={{ marginRight: 10, fontWeight: "bold" }}>
            À partir du :
          </label>
          <input
            type="date"
            id="filtreDate"
            value={filtreDate}
            onChange={(e) => setFiltreDate(e.target.value)}
            style={{ padding: "5px 10px", borderRadius: 4 }}
          />
        </div>
      </div>

      {interventionsFiltrees.length === 0 ? (
        <p>Aucune intervention en cours</p>
      ) : (
        interventionsFiltrees.map((interv) => (
          <div
            key={interv._id}
            style={{
              padding: 15,
              marginBottom: 10,
              border: "1px solid #ccc",
              borderRadius: 8,
              background: "#f9f9f9",
            }}
          >
            <h3>🧍 {interv.patientName}</h3>
            <p>
              <strong>Gravité :</strong> {interv.gravite}
            </p>
            <p>
              <strong>Ambulance :</strong> {interv.ambulanceId?.id || "N/A"} (
              {interv.ambulanceId?.type})
            </p>
            <p>
              <strong>Localisation :</strong> {interv.localisation}
            </p>
            <p>
              <strong>Début :</strong>{" "}
              {new Date(interv.debutIntervention).toLocaleString()}
            </p>
            <button
              onClick={() => terminerIntervention(interv._id)}
              style={{
                padding: "6px 12px",
                backgroundColor: "#27ae60",
                color: "white",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Terminer
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ListeInterventions;
