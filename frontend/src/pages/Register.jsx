import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  // Infos hôpital
  const [adresseHopital, setAdresseHopital] = useState('');
  const [nombreAmbulances, setNombreAmbulances] = useState('');
  const [responsableHopital, setResponsableHopital] = useState('');
  const [telephoneHopital, setTelephoneHopital] = useState('');

  // Infos ambulancier
  const [hopitalNom, setHopitalNom] = useState('');
  const [numeroAmbulance, setNumeroAmbulance] = useState('');
  const [telephoneAmbulancier, setTelephoneAmbulancier] = useState('');
  const [permis, setPermis] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation simple côté client
    if (!nom || !email || !password || !role) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (role === 'hopital') {
      if (!adresseHopital || !nombreAmbulances || !responsableHopital || !telephoneHopital) {
        setError('Veuillez remplir tous les champs du formulaire Hôpital.');
        return;
      }
    }

    if (role === 'ambulancier') {
      if (!hopitalNom || !numeroAmbulance || !telephoneAmbulancier) {
        setError('Veuillez remplir tous les champs du formulaire Ambulancier.');
        return;
      }
    }

    // Préparer details selon role
    const details =
      role === 'hopital'
        ? {
            adresse: adresseHopital,
            nombreAmbulances: Number(nombreAmbulances),
            responsable: responsableHopital,
            telephone: telephoneHopital,
          }
        : {
            hopitalNom,
            numeroAmbulance,
            telephone: telephoneAmbulancier,
            permis,
          };

    const payload = {
      nom,
      email,
      password,
      role,
      details,
    };

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Erreur lors de l’inscription');
      } else {
        setSuccess(data.message || 'Inscription réussie !');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError('Erreur réseau');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Créer un compte</h2>
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Nom complet"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={styles.input}
        >
          <option value="">Sélectionner un rôle</option>
          <option value="hopital">Hôpital</option>
          <option value="ambulancier">Ambulancier</option>
        </select>

        {role === 'hopital' && (
          <div style={styles.card}>
            <h4 style={styles.subTitle}>Informations Hôpital</h4>

            <input
              type="text"
              placeholder="Adresse"
              value={adresseHopital}
              onChange={(e) => setAdresseHopital(e.target.value)}
              required
              style={styles.input}
            />

            <input
              type="number"
              placeholder="Nombre d’ambulances"
              value={nombreAmbulances}
              onChange={(e) => setNombreAmbulances(e.target.value)}
              required
              min="0"
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Nom du responsable"
              value={responsableHopital}
              onChange={(e) => setResponsableHopital(e.target.value)}
              required
              style={styles.input}
            />

            <input
              type="tel"
              placeholder="Téléphone"
              value={telephoneHopital}
              onChange={(e) => setTelephoneHopital(e.target.value)}
              required
              style={styles.input}
            />
          </div>
        )}

        {role === 'ambulancier' && (
          <div style={styles.card}>
            <h4 style={styles.subTitle}>Informations Ambulancier</h4>

            <input
              type="text"
              placeholder="Nom de l’hôpital associé"
              value={hopitalNom}
              onChange={(e) => setHopitalNom(e.target.value)}
              required
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Numéro d’ambulance"
              value={numeroAmbulance}
              onChange={(e) => setNumeroAmbulance(e.target.value)}
              required
              style={styles.input}
            />

            <input
              type="tel"
              placeholder="Téléphone"
              value={telephoneAmbulancier}
              onChange={(e) => setTelephoneAmbulancier(e.target.value)}
              required
              style={styles.input}
            />

            <label style={{ marginBottom: 10 }}>
              <input
                type="checkbox"
                checked={permis}
                onChange={(e) => setPermis(e.target.checked)}
              />{' '}
              Permis de conduire valide
            </label>
          </div>
        )}

        <button type="submit" style={styles.button}>
          S’inscrire
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: '50px auto',
    padding: 30,
    backgroundColor: '#f4f6f8',
    borderRadius: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subTitle: {
    marginBottom: 10,
    color: '#555',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    border: '1px solid #ddd',
    marginBottom: 15,
  },
  button: {
    padding: 12,
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  error: {
    backgroundColor: '#ffe6e6',
    color: '#cc0000',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    textAlign: 'center',
  },
  success: {
    backgroundColor: '#e6ffee',
    color: '#006600',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    textAlign: 'center',
  },
};
