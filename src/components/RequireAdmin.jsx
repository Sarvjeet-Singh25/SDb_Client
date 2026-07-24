import { Navigate } from "react-router-dom";

// Wrap any admin-only route with this. It only checks that a token exists —
// the backend still verifies the token is valid on every request, and
// lib/api.js redirects to /admin/login automatically if a request comes
// back 401 (e.g. the token expired).
export default function RequireAdmin({ children }) {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
