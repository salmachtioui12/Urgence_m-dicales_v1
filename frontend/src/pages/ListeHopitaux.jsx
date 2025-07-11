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
    <div className="container">
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
        <h2 className="title">🏥 Liste des Hôpitaux</h2>
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

      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        
        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          width: 100%;
        }
        
        .title {
          margin: 0;
          color: #2d3748;
          font-size: 28px;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .filter-container {
          display: flex;
          justify-content: flex-end;
          min-width: 250px;
        }
        
        .filter-input {
          padding: 12px 15px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          width: 100%;
          max-width: 300px;
          font-size: 16px;
          transition: border-color 0.2s;
        }
        
        .filter-input:focus {
          outline: none;
          border-color: #4299e1;
        }
        
        .hopitaux-list {
          display: grid;
          gap: 20px;
        }
        
        .hopital-card {
          background: linear-gradient(to right, #ffffff, #f9fafb);
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
          position: relative;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
          border: 1px solid #2f8ae6ff;
        }
        
        .hopital-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
        }
        
        .hopital-card.editing {
          box-shadow: 0 0 0 2px #4299e1;
          border-color: #4299e1;
        }
        
        .hopital-card h3 {
          margin: 0 0 10px 0;
          color: #2c5282;
          font-size: 22px;
          font-weight: 700;
        }
        
        .adresse {
          margin: 8px 0 18px;
          color: #718096;
          font-style: italic;
          font-size: 15px;
        }
        
        .details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 15px;
          color: #4a5568;
          margin-bottom: 30px;
        }
        
        .ambulances-list {
          margin: 5px 0 0 20px;
          padding: 0;
        }
        
        .ambulances-list li {
          list-style-type: disc;
          margin-bottom: 4px;
        }
        
        .card-actions {
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          gap: 10px;
        }
        
        .edit-btn, .delete-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 18px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .edit-btn {
          background-color: #4299e1;
          color: white;
          border-radius: 18px;
        }
        
        .edit-btn:hover {
          background-color: #3182ce;
        }
        
        .delete-btn {
          background-color: #f56565;
          color: white;
        }
        
        .delete-btn:hover {
          background-color: #e53e3e;
        }
        
        /* Edit form styles */
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .edit-form h3 {
          margin: 0 0 10px 0;
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group label {
          font-size: 14px;
          color: #4a5568;
          font-weight: 500;
        }
        
        .form-group input, .form-group select {
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        
        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: #4299e1;
        }
        
        .position-inputs {
          display: flex;
          gap: 10px;
        }
        
        .position-inputs input {
          flex: 1;
        }
        
        .ambulance-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        
        .ambulance-row input {
          width: 80px;
        }
        
        .ambulance-row select {
          flex: 1;
        }
        
        .add-ambulance {
          margin-top: 15px;
        }
        
        .add-btn, .remove-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background-color: rgba(0, 0, 0, 0.05);
          color: #333;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          transition: background-color 0.2s ease, transform 0.1s ease;
        }
        
        .add-btn:hover, .remove-btn:hover {
          background-color: rgba(0, 0, 0, 0.1);
          transform: scale(1.05);
        }
        
        .add-btn:hover {
          background-color: #38a169;
          color: white;
        }
        
        .remove-btn:hover {
          background-color: #e53e3e;
          color: white;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 15px;
          border-top: 1px solid #edf2f7;
        }
        
        .cancel-btn, .save-btn {
          padding: 10px 20px;
          border-radius: 18px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .cancel-btn {
          background-color: white;
          border: 1px solid #e2e8f0;
          color: #4a5568;
        }
        
        .cancel-btn:hover {
          background-color: #f7fafc;
        }
        
        .save-btn {
          background-color: #4299e1;
          border: none;
          color: white;
        }
        
        .save-btn:hover {
          background-color: #3182ce;
        }
        
        .no-results {
          text-align: center;
          color: #718096;
          padding: 30px 0;
        }

        /* Pagination styles */
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 30px;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .page-btn {
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          background-color: white;
          color: #4a5568;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 40px;
          text-align: center;
        }
        
        .page-btn:hover:not(:disabled) {
          background-color: #f7fafc;
        }
        
        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .page-btn.active {
          background-color: #4299e1;
          color: white;
          border-color: #4299e1;
        }

        /* Confirm dialog styles */
        .confirm-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }
        
        .confirm-dialog {
          background-color: white;
          border-radius: 12px;
          padding: 20px;
          width: 350px;
          max-width: 90%;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .confirm-message {
          margin-bottom: 20px;
          font-size: 16px;
          color: #333;
          text-align: center;
        }
        
        .confirm-buttons {
          display: flex;
          justify-content: center;
          gap: 15px;
        }
        
        .confirm-cancel, .confirm-ok {
          padding: 10px 20px;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
        }
        
        .confirm-cancel {
          background-color: #ecf0f1;
          color: #7f8c8d;
        }
        
        .confirm-cancel:hover {
          background-color: #bdc3c7;
        }
        
        .confirm-ok {
          background-color: #e74c3c;
          color: white;
        }
        
        .confirm-ok:hover {
          background-color: #c0392b;
        }

        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .filter-container {
            width: 100%;
            max-width: none;
            justify-content: flex-start;
          }
          
          .filter-input {
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}