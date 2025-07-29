// src/components/NotificationList.jsx
import React, { useState } from "react";
import { useNotification } from "../components/NotificationContext";

const NotificationList = () => {
  const {
    notifications,
    canPlaySound,
    handleEnableSound,
    clearNotifications,
    setNotifications,
  } = useNotification();

  const [showNotifications, setShowNotifications] = useState(false);

  const removeNotification = async (id, indexToRemove) => {
    try {
      await fetch(`http://localhost:3000/notifications/${id}`, {
        method: "DELETE",
      });
      setNotifications((prev) => prev.filter((_, i) => i !== indexToRemove));
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const styles = {
    container: {
      padding: "24px",
      maxWidth: "480px",
      margin: "40px auto",
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#ffffff",
      borderRadius: "20px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      border: "1px solid rgba(0,0,0,0.04)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      paddingBottom: "16px",
      borderBottom: "1px solid rgba(0,0,0,0.05)",
    },
    title: {
      fontSize: "20px",
      fontWeight: "600",
      margin: 0,
      color: "#1a1a1a",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    button: {
      padding: "10px 16px",
      fontSize: "14px",
      cursor: "pointer",
      borderRadius: "10px",
      border: "none",
      backgroundColor: "#3a86ff",
      color: "white",
      fontWeight: "500",
      transition: "all 0.2s ease",
    },
    soundButton: {
      backgroundColor: "#10b981",
      marginRight: "12px",
    },
    deleteAllButton: {
      backgroundColor: "#ef4444",
    },
    buttonGroup: {
      display: "flex",
      marginBottom: "20px",
    },
    list: {
      listStyle: "none",
      padding: 0,
      maxHeight: "400px",
      overflowY: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: "#e0e0e0 transparent",
    },
    item: {
      marginBottom: "12px",
      padding: "18px 20px",
      borderRadius: "12px",
      backgroundColor: "#f8fafc",
      position: "relative",
      color: "#334155",
      fontSize: "14px",
      lineHeight: "1.5",
      boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      borderLeft: "4px solid #3a86ff",
    },
    closeButton: {
      position: "absolute",
      top: "12px",
      right: "12px",
      background: "transparent",
      border: "none",
      fontSize: "14px",
      cursor: "pointer",
      color: "#94a3b8",
    },
    showButton: {
      padding: "14px 28px",
      fontSize: "15px",
      borderRadius: "12px",
      backgroundColor: "#3a86ff",
      color: "white",
      border: "none",
      cursor: "pointer",
      fontWeight: "500",
      boxShadow: "0 4px 12px rgba(58, 134, 255, 0.25)",
    },
    emptyState: {
      textAlign: "center",
      color: "#94a3b8",
      padding: "40px 20px",
      fontSize: "14px",
    },
    notificationIcon: {
      color: "#3a86ff",
      marginRight: "8px",
    },
  };

  return (
    <div style={styles.container}>
      {!showNotifications ? (
        <button onClick={() => setShowNotifications(true)} style={styles.showButton}>
          Afficher les notifications
        </button>
      ) : (
        <>
          <div style={styles.header}>
            <h2 style={styles.title}>
              <span style={styles.notificationIcon}>🔔</span>
              Notifications
            </h2>
            <button onClick={() => setShowNotifications(false)} style={styles.button}>
              Cacher
            </button>
          </div>

          <div style={styles.buttonGroup}>
            {!canPlaySound && (
              <button
                onClick={handleEnableSound}
                style={{ ...styles.button, ...styles.soundButton }}
              >
                Activer le son
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                style={{ ...styles.button, ...styles.deleteAllButton }}
              >
                Tout supprimer
              </button>
            )}
          </div>

          <ul style={styles.list}>
            {notifications.length === 0 ? (
              <div style={styles.emptyState}>Aucune notification pour le moment</div>
            ) : (
              notifications.map((n, i) => (
                <li key={n._id || i} style={styles.item}>
                  <div>
                    <strong>🧑 Patient :</strong> {n.patientName}
                  </div>
                  <div>
                    <strong>📍 Localisation :</strong> {n.localisation}
                  </div>
                  <div>
                    <strong>🕒 Heure :</strong>{" "}
                    {new Date(n.heureAppel).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>
                  <div>
                    <strong>🚨 Gravité :</strong> {n.gravite || "Critique"}
                  </div>
                  <button
                    onClick={() => removeNotification(n._id, i)}
                    style={styles.closeButton}
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default NotificationList;
