import React, { useEffect, useState } from "react";
import './ListeHopitaux.css';

export default function ListeHopitaux() {
  const [hopitaux, setHopitaux] = useState([]);
  const [filtreNom, setFiltreNom] = useState("");
  const [expandedHopitalId, setExpandedHopitalId] = useState(null);
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

  function toggleDetails(id) {
    setExpandedHopitalId(expandedHopitalId === id ? null : id);
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
        <h2 className="title">Liste des Hôpitaux</h2>
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
            <div key={h._id} className="hopital-card">
              <div className="hopital-header">
                <h3>{h.nom}</h3>
                <div className="hopital-buttons">
                  <button
                    onClick={() => toggleDetails(h._id)}
                    className="details-btn"
                  >
                    {expandedHopitalId === h._id ? "Masquer" : "Détails"}
                  </button>
                 
                </div>
              </div>
              
              <p className="adresse">{h.adresse ?? "Adresse inconnue"}</p>
              
              <div className="basic-info">
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

              {expandedHopitalId === h._id && (
                <div className="detailed-info">
                  <div className="info-section">
                    <h4>Contact</h4>
                    <ul>
                      <li><strong>Téléphone urgence:</strong> {h.contact?.telephoneUrgence || "Non renseigné"}</li>
                      <li><strong>Téléphone secondaire:</strong> {h.contact?.telephoneSecondaire || "Non renseigné"}</li>
                      <li><strong>Email:</strong> {h.contact?.email || "Non renseigné"}</li>
                      <li><strong>Site web:</strong> {h.contact?.siteWeb || "Non renseigné"}</li>
                    </ul>
                  </div>

                  <div className="info-section">
                    <h4>Capacités</h4>
                    <ul>
                      <li><strong>Nombre de lits:</strong> {h.capacites?.lits || "Non renseigné"}</li>
                      <li><strong>Salles d'opération:</strong> {h.capacites?.sallesOperation || "Non renseigné"}</li>
                      <li><strong>Service d'urgence:</strong> {h.capacites?.urgenceDisponible ? "Disponible" : "Non disponible"}</li>
                      <li><strong>Heures d'ouverture:</strong> {h.capacites?.heuresOuverture || "Non renseigné"}</li>
                    </ul>
                  </div>

                  <div className="info-section">
                    <h4>Localisation</h4>
                    <ul>
                      <li><strong>Latitude:</strong> {h.position?.lat?.toFixed(4) || "Inconnue"}</li>
                      <li><strong>Longitude:</strong> {h.position?.lng?.toFixed(4) || "Inconnue"}</li>
                      <li><strong>Région:</strong> {h.region || "Non renseignée"}</li>
                    </ul>
                  </div>
                </div>
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