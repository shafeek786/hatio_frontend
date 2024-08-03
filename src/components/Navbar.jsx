import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/projects")) {
      setMenu("project");
    } else {
      setMenu("home");
    }
  }, [location.pathname]);

  return (
    <div className="flex items-center justify-between p-5 bg-white shadow-md">
      <Link to="/" className="text-2xl font-bold text-gray-800">
        TodoApp
      </Link>
      <ul className="flex gap-5 text-gray-600 text-lg">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={`cursor-pointer ${
            menu === "home" ? "border-b-2 border-gray-800" : ""
          }`}
        >
          Home
        </Link>
        {location.pathname.startsWith("/projects") && (
          <Link
            onClick={() => setMenu("project")}
            className={menu === "project" ? "border-b-2 border-gray-800" : ""}
          >
            Project Details
          </Link>
        )}
      </ul>
      <div className="flex items-center gap-5">
        {isAuthenticated && (
          <span
            onClick={() => {
              logout();
              window.location.href = "/";
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
