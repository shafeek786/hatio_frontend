import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menu, setMenu] = useState("home"); // State to track the active menu item
  const { isAuthenticated, logout } = useAuth(); // Auth context for authentication state and logout function
  const location = useLocation(); // Hook to access the current location

  // Update the active menu item based on the current path
  useEffect(() => {
    if (location.pathname.startsWith("/projects")) {
      setMenu("project");
    } else if (location.pathname.startsWith("/login")) {
      setMenu("login");
    } else {
      setMenu("home");
    }
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-between p-5 bg-white shadow-md">
      {/* Application logo or name */}
      <Link to="/" className="text-2xl font-bold text-gray-800">
        TodoApp
      </Link>

      {/* Navigation links */}
      <ul className="flex gap-5 text-gray-600 text-lg mx-auto">
        {/* Home link */}
        {location.pathname !== "/login" &&
          location.pathname !== "/register" && (
            <li>
              <Link
                to="/"
                onClick={() => setMenu("home")} // Set active menu to "home" when clicked
                className={`cursor-pointer ${
                  menu === "home" ? "border-b-2 border-gray-800" : ""
                }`}
              >
                Home
              </Link>
            </li>
          )}

        {/* Project Details link, shown only if path starts with "/projects" */}
        {location.pathname.startsWith("/projects") && (
          <li>
            <Link
              to="/projects"
              onClick={() => setMenu("project")} // Set active menu to "project" when clicked
              className={menu === "project" ? "border-b-2 border-gray-800" : ""}
            >
              Project Details
            </Link>
          </li>
        )}

        {/* Login link, shown only if path starts with "/login" */}
        {location.pathname.startsWith("/login") && (
          <li>
            <Link
              to="/login"
              onClick={() => setMenu("login")} // Set active menu to "login" when clicked
              className={menu === "login" ? "border-b-2 border-gray-800" : ""}
            >
              Login
            </Link>
          </li>
        )}
      </ul>

      {/* Logout section */}
      <div className="flex items-center gap-5">
        {isAuthenticated && (
          <span
            onClick={() => {
              logout(); // Call logout function from context
              window.location.href = "/"; // Redirect to home after logout
            }}
            className="cursor-pointer text-red-500 hover:text-red-600"
          >
            Logout
          </span>
        )}
      </div>
    </div>
  );
};

export default Navbar;
