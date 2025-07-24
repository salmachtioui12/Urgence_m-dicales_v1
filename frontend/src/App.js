import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Cart from "./pages/cart";
import ListeAppels from "./pages/ListeAppels";
import ListeHopitaux from "./pages/ListeHopitaux";
import ListeAmbulances from "./pages/ListeAmbulances";
import ListeInterventions from "./pages/ListeInterventions";
import NotificationsPage from "./components/WebSocketNotifications";
import DashboardKPI from "./components/DashboardKPI";
import Layout from "./Layout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="cart"element={<Cart />} />
          <Route path="appels" element={<ListeAppels />} />
          <Route path="hopitaux" element={<ListeHopitaux />} />
          <Route path="ambulances" element={<ListeAmbulances />} />
          <Route path="interventions" element={<ListeInterventions />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="dashboard" element={<DashboardKPI />} />
        </Route>
      </Routes>
    </Router>
  );
}
