import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Home,
  Map,
  Ambulance,
  PhoneCall,
  Hospital,
  ListOrdered,
  Filter,
  BarChart2,
  AlertTriangle,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const menu = [
    { icon: <Home size={24} />, label: "Accueil", path: "/" },
    { icon: <Map size={24} />, label: "Carte", path: "/" },
    { icon: <Ambulance size={24} />, label: "Ambulances", path: "/ambulances" },
    { icon: <PhoneCall size={24} />, label: "Appels d'urgence", path: "/appels" },
    { icon: <Hospital size={24} />, label: "Hôpitaux", path: "/hopitaux" },
    { icon: <ListOrdered size={24} />, label: "Interventions", path: "/interventions" },
    { icon: <Filter size={24} />, label: "Filtres", path: "/filtres" },
    { icon: <BarChart2 size={24} />, label: "Statistiques", path: "/statistiques" },
    { icon: <AlertTriangle size={24} />, label: "Notifications", path: "/notifications" },
  ];

  return (
    <div className="sidebar">
      {menu.map((item, index) => (
        <div
          key={index}
          className="sidebar-icon"
          title={item.label}
          style={{ cursor: "pointer" }}
          onClick={() => navigate(item.path)}  // navigation au clic
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
