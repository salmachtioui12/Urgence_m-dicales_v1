import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";

export default function LayoutHopital() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 970);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 970;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false); // Fermer le menu si on repasse en desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navStyle = {
    backgroundColor: "#ffffff",
    padding: "1rem 2rem",
    borderRadius: "50px",
    margin: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
  };

  const logoStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#1e88e5",
    textDecoration: "none",
  };

  const ulStyle = {
    listStyle: "none",
    display: isMobile ? (menuOpen ? "flex" : "none") : "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "1.5rem",
    margin: 0,
    padding: 0,
    width: isMobile ? "100%" : "auto",
    textAlign: isMobile ? "center" : "left",
  };

  const linkStyle = {
    color: "#2c3e50",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "1rem",
    padding: "0.5rem 1rem",
    borderRadius: "50px",
    transition: "background-color 0.3s ease",
  };

  const activeLinkStyle = {
    backgroundColor: "#2979ff",
    color: "#fff",
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#f44336",
    border: "none",
    color: "#fff",
    borderRadius: "50px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginTop: isMobile ? "1rem" : "0",
  };

  const mainStyle = {
    padding: "2rem",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const burgerStyle = {
    display: isMobile ? "block" : "none",
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#2c3e50",
  };

  return (
    <div>
      <nav style={navStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <NavLink to="/hopital" style={logoStyle}>
            youcare
          </NavLink>
          <button style={burgerStyle} onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>

        <ul style={ulStyle}>
          <li>
            <NavLink
              to="/hopital/dashboard"
              style={({ isActive }) => ({
                ...linkStyle,
                ...(isActive ? activeLinkStyle : {}),
              })}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/hopital/demandes"
              style={({ isActive }) => ({
                ...linkStyle,
                ...(isActive ? activeLinkStyle : {}),
              })}
            >
              Demandes
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/hopital/ambulanciers"
              style={({ isActive }) => ({
                ...linkStyle,
                ...(isActive ? activeLinkStyle : {}),
              })}
            >
              Ambulanciers
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/hopital/notifications"
              style={({ isActive }) => ({
                ...linkStyle,
                ...(isActive ? activeLinkStyle : {}),
              })}
            >
              Notifications
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/hopital/profil"
              style={({ isActive }) => ({
                ...linkStyle,
                ...(isActive ? activeLinkStyle : {}),
              })}
            >
              Profil
            </NavLink>
          </li>
          {isMobile && (
            <li>
              <button
                onClick={handleLogout}
                style={buttonStyle}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#d32f2f")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
              >
                Déconnexion
              </button>
            </li>
          )}
        </ul>

        {!isMobile && (
          <button
            onClick={handleLogout}
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#d32f2f")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f44336")}
          >
            Déconnexion
          </button>
        )}
      </nav>
      <main style={mainStyle}>
        <Outlet />
      </main>
    </div>
  );
}
