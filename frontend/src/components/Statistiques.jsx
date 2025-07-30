import React, { useEffect, useState, useRef } from "react";
import LineChartAppels from "./LineChartAppels";

export default function Statistiques() {
  const [appelsParHeure, setAppelsParHeure] = useState([]);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:3000");

    wsRef.current.onopen = () => {
      console.log("✅ WebSocket connecté Statistiques");
      setLoading(true);
      // Tu peux envoyer une demande initiale si besoin, sinon le serveur pousse les données régulièrement
      wsRef.current.send(JSON.stringify({ action: "getAppelsParHeure" }));
    };

    wsRef.current.onmessage = (message) => {
      try {
        const parsed = JSON.parse(message.data);
        if (parsed.type === "APPELS_PAR_HEURE_UPDATE") {
          setAppelsParHeure(parsed.data);
          setLoading(false);
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

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#1e88e5",
          marginBottom: 20,
          textTransform: "uppercase",
        }}
      >
        Statistiques des urgences
      </h1>

      {loading && <p style={{ textAlign: "center" }}>Chargement des statistiques...</p>}

      {!loading && appelsParHeure.length === 0 && (
        <p style={{ textAlign: "center", color: "#999" }}>Aucune donnée disponible pour le moment.</p>
      )}

      {!loading && appelsParHeure.length > 0 && (
        <div style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <LineChartAppels data={appelsParHeure} />
        </div>
      )}
    </div>
  );
}
