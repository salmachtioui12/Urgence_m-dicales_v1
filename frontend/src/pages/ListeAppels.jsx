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
          <option value="terminée">Terminée</option>
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
/*
import React, { useEffect, useState } from "react";

export default function ListeHopitaux() {
  const [hopitaux, setHopitaux] = useState([]);
  const [filtreNom, setFiltreNom] = useState("");
  const [editingHopitalId, setEditingHopitalId] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    position: { lat: 0, lng: 0 },
    ambulances: []
  });
  const [newAmbulance, setNewAmbulance] = useState({ id: "", type: "A" });

  const fetchHopitaux = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/hopitaux/stocks`);
      const data = await res.json();
      setHopitaux(data);
    } catch (err) {
      console.error("Erreur fetch hopitaux:", err);
    }
  };

  useEffect(() => {
    fetchHopitaux();
  }, []);

  const hopitauxFiltres = hopitaux.filter((h) =>
    !filtreNom || (h.nom && h.nom.toLowerCase().includes(filtreNom.toLowerCase()))
  );

  function startEdit(hopital) {
    setEditingHopitalId(hopital._id);
    setFormData({
      nom: hopital.nom || "",
      adresse: hopital.adresse || "",
      position: {
        lat: hopital.position?.lat || 0,
        lng: hopital.position?.lng || 0,
      },
      ambulances: hopital.ambulances ? [...hopital.ambulances] : []
    });
    setNewAmbulance({ id: "", type: "A" });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "lat" || name === "lng") {
      setFormData((fd) => ({
        ...fd,
        position: { ...fd.position, [name]: parseFloat(value) || 0 },
      }));
    } else {
      setFormData((fd) => ({ ...fd, [name]: value }));
    }
  }

  function handleAmbulanceChange(index, field, value) {
    const updatedAmbulances = [...formData.ambulances];
    updatedAmbulances[index] = {
      ...updatedAmbulances[index],
      [field]: field === 'id' ? parseInt(value) || 0 : value
    };
    setFormData(fd => ({ ...fd, ambulances: updatedAmbulances }));
  }

  function handleNewAmbulanceChange(e) {
    const { name, value } = e.target;
    setNewAmbulance(prev => ({ 
      ...prev, 
      [name]: name === 'id' ? parseInt(value) || 0 : value 
    }));
  }

  function addAmbulance() {
    if (!newAmbulance.id || formData.ambulances.some(a => a.id === newAmbulance.id)) {
      alert("ID d'ambulance invalide ou déjà existant");
      return;
    }
    
    setFormData(fd => ({
      ...fd,
      ambulances: [...fd.ambulances, { ...newAmbulance }]
    }));
    setNewAmbulance({ id: "", type: "A" });
  }

  function removeAmbulance(index) {
    setFormData(fd => ({
      ...fd,
      ambulances: fd.ambulances.filter((_, i) => i !== index)
    }));
  }

  async function submitUpdate() {
    if (!editingHopitalId) return;

    try {
      const res = await fetch(`http://localhost:3000/api/hopitaux/${editingHopitalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          nombreAmbulances: formData.ambulances.length
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      await fetchHopitaux();
      setEditingHopitalId(null);
    } catch (err) {
      alert(err.message);
    }
  }

  async function deleteHopital(id) {
    if (!window.confirm("Confirmez-vous la suppression de cet hôpital ?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/hopitaux/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      await fetchHopitaux();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div style={{
      maxWidth: 1000,
      margin: "20px auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 20, color: "#34495e" }}>
        🏥 Gestion des Hôpitaux et Ambulances
      </h2>


      <div style={{ display: "grid", gap: 20 }}>
        {hopitauxFiltres.map((h) => (
          <div key={h._id} style={cardStyle}>
            {editingHopitalId === h._id ? (
              <>
           
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Nom de l'hôpital"
                  style={inputStyle}
                />
                
              
                <div style={{ marginTop: 15 }}>
                  <h4 style={{ marginBottom: 10 }}>Gestion des Ambulances</h4>
                  <div style={{
        display: "flex",
        gap: 10,
        marginBottom: 20,
        justifyContent: "center",
        flexWrap: "wrap",
      }}>
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
      </div>
                  {formData.ambulances.map((amb, index) => (
                    <div key={index} style={ambulanceItemStyle}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>ID:</label>
                        <input
                          type="number"
                          value={amb.id}
                          onChange={(e) => handleAmbulanceChange(index, 'id', e.target.value)}
                          style={{ ...inputStyle, width: 60 }}
                        />
                      </div>
                      
                      <div style={{ flex: 1.5 }}>
                        <label style={labelStyle}>Type:</label>
                        <select
                          value={amb.type}
                          onChange={(e) => handleAmbulanceChange(index, 'type', e.target.value)}
                          style={selectStyle}
                        >
                          <option value="A">Type A (Basique)</option>
                          <option value="B">Type B (Intermédiaire)</option>
                          <option value="C">Type C (Avancée)</option>
                        </select>
                      </div>
                      
                      <button 
                        onClick={() => removeAmbulance(index)}
                        style={deleteButtonStyle}
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}

                // Formulaire d'ajout d'une nouvelle ambulance 
                  <div style={{ ...ambulanceItemStyle, marginTop: 15 }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Nouvel ID:</label>
                      <input
                        type="number"
                        name="id"
                        placeholder="ID"
                        value={newAmbulance.id}
                        onChange={handleNewAmbulanceChange}
                        style={{ ...inputStyle, width: 60 }}
                      />
                    </div>
                    
                    <div style={{ flex: 1.5 }}>
                      <label style={labelStyle}>Type:</label>
                      <select
                        name="type"
                        value={newAmbulance.type}
                        onChange={handleNewAmbulanceChange}
                        style={selectStyle}
                      >
                        <option value="A">Type A</option>
                        <option value="B">Type B</option>
                        <option value="C">Type C</option>
                      </select>
                    </div>
                    
                    <button
                      onClick={addAmbulance}
                      style={addButtonStyle}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                // Boutons d'action 
                <div style={actionButtonsStyle}>
                  <button onClick={submitUpdate} style={saveButtonStyle}>
                    Sauvegarder
                  </button>
                  <button onClick={() => setEditingHopitalId(null)} style={cancelButtonStyle}>
                    Annuler
                  </button>
                </div>
              </>
            ) : (
              <>
                //* Affichage en mode lecture 
                <h3 style={{ margin: 0, color: "#2c3e50" }}>{h.nom}</h3>
                <p style={{ margin: "6px 0", color: "#34495e" }}>{h.adresse || "Adresse non spécifiée"}</p>
                
                <div style={{ marginTop: 10 }}>
                  <h4>Ambulances ({h.ambulances?.length || 0})</h4>
                  {h.ambulances?.length > 0 ? (
                    <ul style={{ paddingLeft: 20 }}>
                      {h.ambulances.map((a, idx) => (
                        <li key={idx} style={{ marginBottom: 5 }}>
                          <strong>Ambulance {a.id}</strong> - Type: {getAmbulanceTypeName(a.type)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucune ambulance enregistrée</p>
                  )}
                </div>

                <div style={actionButtonsStyle}>
                  <button onClick={() => startEdit(h)} style={editButtonStyle}>
                    Modifier
                  </button>
                  <button onClick={() => deleteHopital(h._id)} style={deleteButtonStyle}>
                    Supprimer
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Fonction helper pour afficher le type d'ambulance
function getAmbulanceTypeName(type) {
  switch(type) {
    case 'A': return 'Basique';
    case 'B': return 'Intermédiaire';
    case 'C': return 'Avancée';
    default: return type;
  }
}

// Styles réutilisables
const cardStyle = {
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  borderRadius: 12,
  padding: 20,
  backgroundColor: "#fff",
  position: "relative"
};

const inputStyle = {
  padding: 8,
  borderRadius: 6,
  border: "1px solid #ddd",
  margin: "5px 0"
};

const selectStyle = {
  ...inputStyle,
  width: "100%"
};

const labelStyle = {
  display: "block",
  marginBottom: 5,
  fontSize: 14,
  color: "#555"
};

const ambulanceItemStyle = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  marginBottom: 10
};

const actionButtonsStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 20
};

const baseButtonStyle = {
  padding: "8px 16px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "bold"
};

const saveButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#2ecc71",
  color: "white"
};

const cancelButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#95a5a6",
  color: "white"
};

const editButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#3498db",
  color: "white"
};

const deleteButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#e74c3c",
  color: "white"
};

const addButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#27ae60",
  color: "white",
  padding: "6px 12px"
};*/
