import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Cart from "./pages/Carte/cart";
import ListeAppels from "./pages/Appels/ListeAppels";
import ListeHopitaux from "./pages/Hopitaux/ListeHopitaux";
import ListeAmbulances from "./pages/Ambulances/ListeAmbulances";
import ListeInterventions from "./pages/Interventions/ListeInterventions";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DemandesAmbulanciers from "./pages/Ambulanciers/DemandesAmbulanciers";

// Composants
import Layout from "./Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardKPI from "./components/Dashboard/DashboardKPI";
import NotificationsPage from "./components/WebSocketNotifications";

export default function App() {
  // Si tu veux passer des props comme hopitalNom, utilise le context ou localStorage côté composant.
  return (
    <Router>
      <Routes>
        {/* 🟢 Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔒 Routes protégées */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Redirection racine vers dashboard */}
          <Route index element={<Navigate to="/dashboard" />} />

          <Route path="dashboard" element={<DashboardKPI />} />
          <Route path="cart" element={<Cart />} />
          <Route path="appels" element={<ListeAppels />} />
          <Route path="hopitaux" element={<ListeHopitaux />} />
          <Route path="ambulances" element={<ListeAmbulances />} />
          <Route path="interventions" element={<ListeInterventions />} />
          <Route path="notifications" element={<NotificationsPage />} />

          {/* ✅ Route pour les demandes d’inscription des ambulanciers */}
          <Route path="demandes-ambulanciers" element={<DemandesAmbulanciers />} />
        </Route>
      </Routes>
    </Router>
  );
}
