import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cart from "./pages/cart";
import Sidebar from "./components/Sidebar"; // Assure-toi du bon chemin
import ListeAppels from "./pages/ListeAppels";
import ListeHopitaux from "./pages/ListeHopitaux";
import ListeAmbulances from "./pages/ListeAmbulances"
import ListeInterventions from "./pages/ListeInterventions";
export default function App() {
  return (
    <Router>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar fixe */}
        <Sidebar />

        {/* Contenu principal (zone routée) */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Cart />} />
            <Route path="/appels" element={<ListeAppels />} />
            <Route path="/hopitaux" element={<ListeHopitaux />} />
            <Route path="/ambulances" element={<ListeAmbulances />} />
            <Route path="/interventions" element={<ListeInterventions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
