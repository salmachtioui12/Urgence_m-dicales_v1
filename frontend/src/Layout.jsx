import React from "react";
import Sidebar from "../src/components/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        overflowY: "auto",
        marginLeft: "60px", // Ajoutez cette marge égale à la largeur de la sidebar
        width: "calc(100% - 60px)", // Calcule la largeur restante
        padding: "20px" // Ajoute un padding pour l'espacement
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;