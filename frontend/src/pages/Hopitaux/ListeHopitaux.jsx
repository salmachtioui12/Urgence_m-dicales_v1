import React, { useEffect, useState } from "react";
import './ListeHopitaux.css'; 

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    message: "",
    onConfirm: () => {}
  });

  const fetchHopitaux = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/hopitaux/stocks`);
      const data = await res.json();
      setHopitaux(data);
    } catch (err) {
      showAlert("Erreur lors du chargement des hôpitaux: " + err.message);
    }
  };

  useEffect(() => {
    fetchHopitaux();
  }, []);

  const showAlert = (message) => {
    setDialogConfig({
      message,
      onConfirm: () => setShowConfirmDialog(false)
    });
    setShowConfirmDialog(true);
  };

  const showConfirm = (message, onConfirm) => {
    setDialogConfig({
      message,
      onConfirm: () => {
        onConfirm();
        setShowConfirmDialog(false);
      }
    });
    setShowConfirmDialog(true);
  };

  const hopitauxFiltres = hopitaux.filter((h) =>
    !filtreNom || (h.nom && h.nom.toLowerCase().includes(filtreNom.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = hopitauxFiltres.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(hopitauxFiltres.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  function startEdit(hopital) {
    setEditingHopitalId(hopital._id);
    setFormData({
      nom: hopital.nom || "",
      adresse: hopital.adresse || "",
      position: {
        lat: hopital.position?.lat || 0,
        lng: hopital.position?.lng || 0,
      },
      ambulances: hopital.ambulances || []
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
    updatedAmbulances[index][field] = value;
    setFormData(fd => ({ ...fd, ambulances: updatedAmbulances }));
  }

  function handleNewAmbulanceChange(e) {
    const { name, value } = e.target;
    setNewAmbulance(prev => ({ ...prev, [name]: value }));
  }

  function addAmbulance() {
    if (!newAmbulance.id) return;
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
          nom: formData.nom,
          adresse: formData.adresse,
          position: formData.position,
          ambulances: formData.ambulances,
          nombreAmbulances: formData.ambulances.length
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      await fetchHopitaux();
      setEditingHopitalId(null);
    } catch (err) {
      showAlert(err.message);
    }
  }

  async function deleteHopital(id) {
    showConfirm("Confirmez-vous la suppression de cet hôpital ?", async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/hopitaux/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Erreur lors de la suppression");
        await fetchHopitaux();
      } catch (err) {
        showAlert(err.message);
      }
    });
  }

  return (
    <div className="liste-hopitaux-container">
      {/* Boîte de dialogue de confirmation */}
      {showConfirmDialog && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <div className="confirm-message">
              {dialogConfig.message}
            </div>
            <div className="confirm-buttons">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="confirm-cancel"
              >
                Annuler
              </button>
              <button
                onClick={dialogConfig.onConfirm}
                className="confirm-ok"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="header-container">
        <h2 className="title"> Liste des Hôpitaux</h2>
        <div className="filter-container">
          <input
            type="text"
            placeholder="Filtrer par nom"
            value={filtreNom}
            onChange={(e) => {
              setFiltreNom(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-input"
          />
        </div>
      </div>

      <div className="hopitaux-list">
        {currentItems.length === 0 ? (
          <p className="no-results">Aucun hôpital trouvé.</p>
        ) : (
          currentItems.map((h) => (
            <div
              key={h._id}
              className={`hopital-card ${editingHopitalId === h._id ? "editing" : ""}`}
            >
              {editingHopitalId === h._id ? (
                <div className="edit-form">
                  <h3>Modifier l'hôpital</h3>

                  <div className="form-group">
                    <label>Nom de l'hôpital</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Adresse</label>
                    <input
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Position</label>
                    <div className="position-inputs">
                      <input
                        type="number"
                        name="lat"
                        step="0.0001"
                        value={formData.position.lat}
                        onChange={handleChange}
                        placeholder="Latitude"
                      />
                      <input
                        type="number"
                        name="lng"
                        step="0.0001"
                        value={formData.position.lng}
                        onChange={handleChange}
                        placeholder="Longitude"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Ambulances</label>
                    
                    {formData.ambulances.map((amb, index) => (
                      <div key={index} className="ambulance-row">
                        <input
                          type="number"
                          value={amb.id}
                          onChange={(e) => handleAmbulanceChange(index, 'id', e.target.value)}
                        />
                        <select
                          value={amb.type}
                          onChange={(e) => handleAmbulanceChange(index, 'type', e.target.value)}
                        >
                          <option value="A">Type A</option>
                          <option value="B">Type B</option>
                          <option value="C">Type C</option>
                        </select>
                        <button 
                          onClick={() => removeAmbulance(index)}
                          className="remove-btn"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    <div className="ambulance-row add-ambulance">
                      <input
                        type="number"
                        name="id"
                        placeholder="ID ambulance"
                        value={newAmbulance.id}
                        onChange={handleNewAmbulanceChange}
                      />
                      <select
                        name="type"
                        value={newAmbulance.type}
                        onChange={handleNewAmbulanceChange}
                      >
                        <option value="A">Type A</option>
                        <option value="B">Type B</option>
                        <option value="C">Type C</option>
                      </select>
                      <button
                        onClick={addAmbulance}
                        className="add-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      onClick={() => setEditingHopitalId(null)}
                      className="cancel-btn"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={submitUpdate}
                      className="save-btn"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{h.nom}</h3>
                  <p className="adresse">{h.adresse ?? "Adresse inconnue"}</p>
                  <div className="details">
                    <div>
                      <strong>Nombre d'ambulances :</strong> {h.nombreAmbulances ?? "Inconnu"}
                    </div>
                    {Array.isArray(h.ambulances) && h.ambulances.length > 0 && (
                      <div>
                        <strong>Types d'ambulances :</strong>
                        <ul className="ambulances-list">
                          {['A', 'B', 'C'].map((type) => {
                            const count = h.ambulances.filter(a => a.type === type).length;
                            return count > 0 ? (
                              <li key={type}>
                                Type {type} : {count} ambulance{count > 1 ? 's' : ''}
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <button 
                      onClick={() => startEdit(h)}
                      className="edit-btn"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteHopital(h._id)}
                      className="delete-btn"
                    >
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {hopitauxFiltres.length > itemsPerPage && (
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-btn"
          >
            &lt;
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`page-btn ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}