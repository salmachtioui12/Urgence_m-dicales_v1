import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
const [lat, setLat] = useState('');
const [lng, setLng] = useState('');

  // Infos ambulancier
  const [hopitalNom, setHopitalNom] = useState('');
  const [numeroAmbulance, setNumeroAmbulance] = useState('');
  const [telephoneAmbulancier, setTelephoneAmbulancier] = useState('');
  const [permis, setPermis] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Validation simple côté client
    if (!nom || !email || !password || !role) {
      setError('Veuillez remplir tous les champs obligatoires.');
      setIsLoading(false);
      return;
    }

    if (role === 'hopital') {
      if (!adresseHopital) {
        setError('Veuillez remplir tous les champs du formulaire Hôpital.');
        setIsLoading(false);
        return;
      }
    }

    if (role === 'ambulancier') {
      if (!hopitalNom) {
        setError('Veuillez remplir tous les champs du formulaire Ambulancier.');
        setIsLoading(false);
        return;
      }
    }

    // Préparer details selon role
    const details =
      role === 'hopital'
        ? {
            adresse: adresseHopital,
            /*nombreAmbulances: Number(nombreAmbulances),
            responsable: responsableHopital,
            telephone: telephoneHopital,*/
            position: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        }
          }
        : {
            hopitalNom,
            /* numeroAmbulance,
            telephone: telephoneAmbulancier,
            permis,*/
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
        setError(data.message || 'Erreur lors de l\'inscription');
      } else {
        setSuccess(data.message || 'Inscription réussie !');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      setError('Erreur réseau');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <h1>Créer un compte</h1>
        <p>Rejoignez notre plateforme en quelques étapes</p>
      </div>

      <div className="login-form-container">
        {error && (
          <div className="alert error">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert success">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="nom">Nom complet</label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              placeholder="Votre nom complet"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Adresse email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="exemple@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Rôle</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="form-select"
            >
              <option value="">Sélectionner un rôle</option>
              <option value="hopital">Hôpital</option>
              <option value="ambulancier">Ambulancier</option>
            </select>
          </div>

          {role === 'hopital' && (
            <div className="form-card">
              <h4 className="form-subtitle">Informations Hôpital</h4>

              <div className="form-group">
                <label htmlFor="adresseHopital">Adresse</label>
                <input
                  id="adresseHopital"
                  type="text"
                  placeholder="Adresse de l'hôpital"
                  value={adresseHopital}
                  onChange={(e) => setAdresseHopital(e.target.value)}
                  required
                />
                  <label htmlFor="lat">Latitude</label>
  <input
    id="lat"
    type="number"
    step="any"
    placeholder="Latitude"
    value={lat}
    onChange={(e) => setLat(e.target.value)}
    required
  />
</div>

<div className="form-group">
  <label htmlFor="lng">Longitude</label>
  <input
    id="lng"
    type="number"
    step="any"
    placeholder="Longitude"
    value={lng}
    onChange={(e) => setLng(e.target.value)}
    required
  />
              </div>
            </div>
          )}

          {role === 'ambulancier' && (
            <div className="form-card">
              <h4 className="form-subtitle">Informations Ambulancier</h4>

              <div className="form-group">
                <label htmlFor="hopitalNom">Nom de l'hôpital associé</label>
                <input
                  id="hopitalNom"
                  type="text"
                  placeholder="Nom de l'hôpital"
                  value={hopitalNom}
                  onChange={(e) => setHopitalNom(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Inscription...
              </>
            ) : 'S\'inscrire'}
          </button>
        </form>

        <div className="login-footer">
          <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%);
          padding: 2rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .login-header {
          text-align: center;
          margin-bottom: 3rem;
          max-width: 500px;
        }

        .login-header h1 {
          font-size: 2rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .login-header p {
          color: #64748b;
          font-size: 1rem;
        }

        .login-form-container {
          width: 100%;
          max-width: 500px;
          background-color: white;
          padding: 2rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
        }

        .alert {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          margin-bottom: 1.5rem;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .alert svg {
          width: 1.25rem;
          height: 1.25rem;
          margin-right: 0.75rem;
        }

        .alert.error {
          background-color: #fef2f2;
          color: #dc2626;
        }

        .alert.success {
          background-color: #f0fdf4;
          color: #16a34a;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #334155;
        }

        .form-group input,
        .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          transition: all 0.15s ease;
          background-color: #f9fafb;
        }

        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 1.5em 1.5em;
        }

        .form-group input:focus,
        .form-select:focus {
          outline: none;
          border-color: #2979ff;
          box-shadow: 0 0 0 1px #2979ff;
          background-color: white;
        }

        .form-group input::placeholder {
          color: #9ca3af;
        }

        .form-card {
          background-color: #f8fafc;
          padding: 1.25rem;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          margin-bottom: 1rem;
        }

        .form-subtitle {
          font-size: 1rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 1rem;
        }

        .login-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #2979ff;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .login-button:hover {
          background-color: #1a6de9;
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          background-color: #2979ff;
        }

        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: #64748b;
        }

        .login-footer a {
          color: #2979ff;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.15s;
        }

        .login-footer a:hover {
          color: #1a6de9;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}