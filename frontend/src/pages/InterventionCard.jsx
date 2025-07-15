import React from "react";
import axios from "axios";

const InterventionCard = ({ intervention, onUpdate }) => {
  const handleTerminer = async () => {
    try {
      const res = await axios.put(`/interventions/${intervention._id}/statut`, {
        statut: "terminée",
      });
      alert("✅ Intervention terminée !");
      onUpdate(); // pour rafraîchir la liste si nécessaire
    } catch (error) {
      console.error("Erreur mise à jour :", error);
      alert("❌ Erreur lors de la mise à jour.");
    }
  };

  return (
    <div style={{
      border: "1px solid #ddd", borderRadius: 10, padding: 15, marginBottom: 10
    }}>
      <h4>{intervention.patientName}</h4>
      <p>📍 {intervention.localisation}</p>
      <p>🚑 Ambulance : {intervention.ambulanceId}</p>
      <p>Gravité : {intervention.gravite}</p>
      <p>Statut : <strong>{intervention.statut}</strong></p>

      {intervention.statut !== "terminée" && (
        <button onClick={handleTerminer} style={{ backgroundColor: "#27ae60", color: "#fff", padding: "8px 16px", border: "none", borderRadius: 5 }}>
          Terminer l’intervention
        </button>
      )}
    </div>
  );
};

export default InterventionCard;
