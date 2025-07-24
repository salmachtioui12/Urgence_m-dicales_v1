import React, { useEffect, useRef, useState } from 'react';
import alertSound from '../assets/alert.mp3';
import styles from './WebSocketNotificationscss'; 
const  WebSocketNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const audioRef = useRef(null);
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);
  const notificationRef = useRef(null);

  // Fermer les notifications quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio(alertSound);

    const fetchInitial = async () => {
      try {
        const res = await fetch('http://localhost:3000/notifications');
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Erreur chargement initial:", err);
      }
    };

    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:3000');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket connecté");
        if (reconnectRef.current) {
          clearInterval(reconnectRef.current);
          reconnectRef.current = null;
        }
      };

      ws.onmessage = (event) => {
  try {
    const payload = JSON.parse(event.data);
    if (payload.type === 'ALERTE_CRITIQUE') {
      const newNotif = payload.data;

      // Vérifie si la notification existe déjà (même id ou même contenu)
      setNotifications(prev => {
        const alreadyExists = prev.some(n =>
          n._id === newNotif._id || (
            n.patientName === newNotif.patientName &&
            n.heureAppel === newNotif.heureAppel &&
            n.localisation === newNotif.localisation
          )
        );
        if (!alreadyExists) {
          return [newNotif, ...prev];
        }
        return prev;
      });

      if (audioEnabled && audioRef.current) {
        audioRef.current.play().catch(err =>
          console.warn("🔇 Erreur audio:", err)
        );
      }
    }
  } catch (err) {
    console.error("Erreur parsing WebSocket:", err);
  }
};

      ws.onclose = () => {
        console.log("🔌 WebSocket fermé, tentative de reconnexion...");
        if (!reconnectRef.current) {
          reconnectRef.current = setInterval(connectWebSocket, 3000);
        }
      };

      ws.onerror = (err) => {
        console.error("❌ Erreur WebSocket :", err);
        ws.close();
      };
    };

    fetchInitial();
    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectRef.current) clearInterval(reconnectRef.current);
    };
  }, [audioEnabled]);

  const removeNotification = async (id, indexToRemove) => {
    try {
      await fetch(`http://localhost:3000/notifications/${id}`, {
        method: 'DELETE'
      });
      setNotifications(prev => prev.filter((_, i) => i !== indexToRemove));
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await fetch('http://localhost:3000/notifications', {
        method: 'DELETE'
      });
      setNotifications([]);
    } catch (err) {
      console.error("Erreur lors de la suppression totale:", err);
    }
  };


  return (
    <div style={styles.container} ref={notificationRef}>
      <button 
        onClick={() => setShowNotifications(!showNotifications)} 
        style={styles.showButton}
      >
        <span>🔔</span>
        Notifications
        {notifications.length > 0 && (
          <span style={styles.badge}>
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div style={styles.notificationPanel}>
          <div style={styles.header}>
            <h3 style={styles.title}>Notifications</h3>
            <div style={styles.controls}>
              <button 
                onClick={() => setAudioEnabled(!audioEnabled)} 
                style={styles.controlButton}
              >
                {audioEnabled ? '🔊 Son' : '🔇 Muet'}
              </button>
              {notifications.length > 0 && (
                <button 
                  onClick={clearAllNotifications} 
                  style={styles.controlButton}
                >
                  Tout effacer
                </button>
              )}
            </div>
          </div>

          <div style={styles.listContainer}>
            <ul style={styles.list}>
              {notifications.length === 0 ? (
                <div style={styles.emptyState}>
                  Aucune notification pour le moment
                </div>
              ) : (
                notifications.map((n, i) => (
                  <li key={n._id || i} style={styles.item}>
                    <div style={styles.itemHeader}>
                      <span style={styles.userName}>{n.patientName || 'Utilisateur'}</span>
                    </div>
                    <div style={styles.messageContent}>
                      <div style={styles.actionContainer}>
                        <span style={styles.action}>
                          {n.type === 'ALERTE_CRITIQUE' ? 'a déclenché une alerte' : 'a posté'}
                        </span>
                        <span style={styles.time}>
                          {new Date(n.heureAppel).toLocaleTimeString('fr-FR', {
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <span style={styles.target}>{n.localisation || 'Upper Menu'}</span>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default WebSocketNotifications;