import React from "react";
import { Navigate } from "react-router-dom";

// ProtectedRoute Component
const ProtectedRoute = ({ children, allowedRoles, user }) => {
  if (!user) {
    // Redirect to login if user is not logged in
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role_name)) {
    // Show "Unauthorized" page if user role is not allowed
    return <div>Unauthorized Access</div>;
  }

  return children;
};

export default ProtectedRoute;
