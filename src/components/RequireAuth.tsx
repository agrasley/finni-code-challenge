import React from "react";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const user = window.localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
