import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardHopital() {
  const [stats, setStats] = useState({
    demandesEnAttente: 0,
    ambulanciersApprouves: 0,
  });
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || !user) return;

    axios
      .get(`http://localhost:3000/api/auth/demandes/ambulanciers/${user.nom}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStats((s) => ({ ...s, demandesEnAttente: res.data.length }));
      })
      .catch(() => setError("Erreur lors du chargement des demandes"));

    // Récupérer ambulanciers approuvés
  }, [token, user]);

  // Styles inline
  const containerStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const titleStyle = {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "2rem",
    textAlign: "center"
  };

  const cardContainerStyle = {
    display: "flex",
    gap: "1.5rem",
    justifyContent: "center",
    flexWrap: "wrap"
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    minWidth: "200px",
    textAlign: "center",
    borderTop: "4px solid #3b82f6"
  };

  const cardTitleStyle = {
    fontSize: "1rem",
    color: "#64748b",
    marginBottom: "0.5rem"
  };

  const cardValueStyle = {
    fontSize: "1.75rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0"
  };

  const errorStyle = {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    textAlign: "center"
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Tableau de bord</h1>
      
      {error && <div style={errorStyle}>{error}</div>}
      
      <div style={cardContainerStyle}>
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Demandes en attente</h3>
          <p style={cardValueStyle}>{stats.demandesEnAttente}</p>
        </div>
        
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>Ambulanciers approuvés</h3>
          <p style={cardValueStyle}>{stats.ambulanciersApprouves}</p>
        </div>
      </div>
    </div>
  );
}