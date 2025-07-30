import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        localStorage.removeItem("token");
        if (res.status === 403 && data.message) {
          setError(data.message);
        } else {
          setError(data.message || "Erreur lors de la connexion");
        }
      } else {
        setSuccess("Connexion réussie !");
        localStorage.setItem("token", data.token);

        // Redirection selon le rôle
        setTimeout(() => {
          if (data.user.role === "hopital") {
            navigate("/ambulanciers-en-attente");
          } else {
            navigate("/dashboard");
          }
        }, 1500);
      }
    } catch (err) {
      setError("Erreur réseau");
      localStorage.removeItem("token");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "60px auto",
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 30, color: "#1e88e5" }}>
        Connexion
      </h2>

      {error && (
        <div
          style={{
            backgroundColor: "#ffe6e6",
            color: "#cc0000",
            padding: 10,
            borderRadius: 6,
            marginBottom: 15,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            backgroundColor: "#e6ffee",
            color: "#006600",
            padding: 10,
            borderRadius: 6,
            marginBottom: 15,
            textAlign: "center",
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontWeight: "600",
            color: "#444",
          }}
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 20,
            borderRadius: 8,
            border: "1.5px solid #ccc",
            fontSize: 16,
            transition: "border-color 0.3s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          placeholder="Entrez votre email"
        />

        <label
          style={{
            display: "block",
            marginBottom: 6,
            fontWeight: "600",
            color: "#444",
          }}
          htmlFor="password"
        >
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 25,
            borderRadius: 8,
            border: "1.5px solid #ccc",
            fontSize: 16,
            transition: "border-color 0.3s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#1e88e5")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          placeholder="Entrez votre mot de passe"
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 14,
            backgroundColor: "#1e88e5",
            border: "none",
            borderRadius: 8,
            color: "white",
            fontWeight: "700",
            fontSize: 18,
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#1565c0")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#1e88e5")}
        >
          Se connecter
        </button>
      </form>

      <p
        style={{
          marginTop: 30,
          textAlign: "center",
          fontSize: 14,
          color: "#555",
        }}
      >
        Pas encore de compte ?{" "}
        <Link
          to="/register"
          style={{ color: "#1e88e5", textDecoration: "underline" }}
        >
          Inscrivez-vous ici
        </Link>
      </p>
    </div>
  );
}
