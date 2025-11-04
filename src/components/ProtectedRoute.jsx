// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // Check if a user is logged in (via localStorage or your AuthContext)
  const user = JSON.parse(localStorage.getItem("user"));

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the requested component
  return children;
}
