import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProjectPage from "./pages/ProjectPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectRoute";
import { ProjectProvider } from "./context/ProjectContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Trash from "./pages/Trash";

/**
 * Main application component that sets up routing, context providers, and global components.
 *
 * - AuthProvider: Provides authentication context throughout the app.
 * - ProjectProvider: Provides project-related context throughout the app.
 * - Router: Manages navigation and routing.
 * - Navbar: Displays navigation links and controls.
 * - Routes: Defines the application's routing structure.
 * - ToastContainer: Displays toast notifications for user feedback.
 */
const App = () => {
  return (
    <AuthProvider>
      {/* Provide authentication context to all components */}
      <ProjectProvider>
        {/* Set up routing for the application */}
        <Router>
          {/* Render the navigation bar on all pages */}
          <Navbar />
          <div>
            <Routes>
              {/* Home page route */}
              {/* ProtectedRoute ensures only authenticated users can access this page */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />

              {/* Project detail page route */}
              {/* ProtectedRoute ensures only authenticated users can access this page */}
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute>
                    <ProjectPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/trash" element={<Trash />} />
              {/* Login page route */}
              {/* Accessible to all users */}
              <Route path="/login" element={<LoginPage />} />

              {/* Registration page route */}
              {/* Accessible to all users */}
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </div>
          {/* Render toast notifications */}
          <ToastContainer />
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
};

export default App;
