import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cart from "./pages/cart";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Cart/>} />
        {/* tu peux ajouter d'autres routes ici */}
      </Routes>
    </Router>
  );
}

