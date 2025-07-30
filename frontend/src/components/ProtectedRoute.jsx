// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // Pas de token → redirige vers login
    return <Navigate to="/login" replace />;
  }

  return children;
}
