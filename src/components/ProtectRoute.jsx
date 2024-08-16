import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";

// ProtectedRoute component to guard routes based on authentication status
const ProtectedRoute = ({ children }) => {
  // Access authentication status from the AuthContext
  const { isAuthenticated } = useAuth();

  // If authenticated, render the children components; otherwise, redirect to login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// PropTypes to validate the type of props passed to the component
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // children prop is required and should be a React node
};

export default ProtectedRoute;
