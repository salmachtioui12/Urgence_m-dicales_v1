import React, { useEffect, useState } from "react";
import axios from "axios";

function DemandesAmbulanciers() {
  const [demandes, setDemandes] = useState([]);
  const [error, setError] = useState(null);

  // Récupérer user et token depuis localStorage (assure-toi que token existe)
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user?.role === "hopital" && token) {
      const nomHopital = user.nom;
      console.log("Chargement demandes pour hôpital:", nomHopital);

      axios
        .get(`http://localhost:3000/api/auth/demandes/ambulanciers/${nomHopital}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          console.log("Demandes reçues:", res.data);
          setDemandes(res.data);
          setError(null);
        })
        .catch((err) => {
          console.error("Erreur chargement demandes", err);
          setError("Erreur lors du chargement des demandes.");
        });
    }
  }, [user, token]);

  const validerAmbulancier = (id) => {
    axios
      .patch(`http://localhost:3000/api/auth/valider/ambulancier/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => setDemandes((prev) => prev.filter((a) => a._id !== id)))
      .catch((err) => {
        console.error(err);
        setError("Erreur lors de la validation.");
      });
  };

  const rejeterAmbulancier = (id) => {
    axios
      .patch(`http://localhost:3000/api/auth/rejeter/ambulancier/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => setDemandes((prev) => prev.filter((a) => a._id !== id)))
      .catch((err) => {
        console.error(err);
        setError("Erreur lors du rejet.");
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Demandes d’inscription des ambulanciers</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {demandes.length === 0 ? (
        <p>Aucune demande en attente</p>
      ) : (
        <ul className="space-y-2">
          {demandes.map((amb) => (
            <li key={amb._id} className="bg-gray-100 p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Nom :</strong> {amb.nom}</p>
                  <p><strong>Email :</strong> {amb.email}</p>
                  <p><strong>Numéro Ambulance :</strong> {amb.details.numeroAmbulance}</p>
                </div>
                <div className="space-x-2">
                  <button onClick={() => validerAmbulancier(amb._id)} className="bg-green-500 text-white px-3 py-1 rounded">Valider</button>
                  <button onClick={() => rejeterAmbulancier(amb._id)} className="bg-red-500 text-white px-3 py-1 rounded">Rejeter</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DemandesAmbulanciers;
