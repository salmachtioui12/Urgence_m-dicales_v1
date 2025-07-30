import React, { useEffect, useState, useRef } from "react";
import LineChartAppels from "../components/LineChartAppels";

export default function Statistiques() {
  const [appelsParHeure, setAppelsParHeure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:3000");

    wsRef.current.onopen = () => {
      console.log("✅ WebSocket connecté Statistiques");
      setLoading(true);
      wsRef.current.send(JSON.stringify({ action: "getAppelsParHeure" }));
    };

    wsRef.current.onmessage = (message) => {
      try {
        const parsed = JSON.parse(message.data);
        if (parsed.type === "APPELS_PAR_HEURE_UPDATE") {
          setAppelsParHeure(parsed.data);
          setLoading(false);
          setLastUpdate(new Date());
        }
      } catch (err) {
        console.error("Erreur parsing WebSocket message", err);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsRef.current.onclose = () => {
      console.log("❌ WebSocket déconnecté Statistiques");
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          fontSize: "1.8rem",
          color: "#999",
          textAlign: "center",
          marginTop: 60,
          fontWeight: "600",
          fontStyle: "italic",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        Chargement des statistiques...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "50px auto",
        padding: 40,
        backgroundColor: "#f0f4f8",
        borderRadius: 16,
        boxShadow: "0 16px 32px rgba(0,0,0,0.12)",
        fontFamily: "'Montserrat', sans-serif",
        color: "#222",
        userSelect: "none",
        display: "flex",
        gap: 40,
      }}
    >
      {/* Graphique à gauche */}
      <div style={{ flex: 1 }}>
        <h1
          style={{
            fontSize: "2.8rem",
            marginBottom: 24,
            fontWeight: "900",
            color: "#1e88e5",
            letterSpacing: "2px",
            textTransform: "uppercase",
            textShadow: "0 1px 4px rgba(30,136,229,0.5)",
            textAlign: "center",
          }}
        >
          Statistiques des Urgences
        </h1>
        <LineChartAppels data={appelsParHeure} />
        <p
          style={{
            marginTop: 20,
            fontSize: "1.3rem",
            fontWeight: "700",
            textAlign: "center",
            color: "#1e88e5",
          }}
        >
          Total appels aujourd'hui :{" "}
          <span style={{ color: "#004c8c" }}>
            {appelsParHeure.reduce((sum, item) => sum + item.total, 0)}
          </span>
        </p>
        <p
          style={{
            fontSize: "1rem",
            color: "#666",
            textAlign: "center",
            marginTop: 8,
            fontStyle: "italic",
            userSelect: "text",
          }}
        >
          Dernière mise à jour : {lastUpdate ? lastUpdate.toLocaleTimeString() : "Inconnue"}
        </p>
      </div>

      {/* Liste des totaux par heure à droite */}
      <div
        style={{
          width: 220,
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          height: "fit-content",
          fontWeight: "600",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: 16, color: "#1e88e5" }}>
          Totaux par heure
        </h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {appelsParHeure.map(({ heure, total }) => (
            <li
              key={heure}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #ddd",
                fontSize: 16,
                color: "#333",
              }}
            >
              <span>{heure}</span>
              <span>{total}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
