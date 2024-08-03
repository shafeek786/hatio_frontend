import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dropdown = ({ setShowDropdown }) => {
  const { logout } = useAuth;

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    <div className="absolute right-28 top-16 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-30 z-50 flex flex-col gap-4 dropdown-menu">
      <div className="absolute top-[-0.7rem] right-4 w-5 h-5 transform rotate-45 bg-white border-l border-t border-gray-300"></div>
      <Link
        to="/profile"
        onClick={toggleDropdown}
        className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
      >
        Profile
      </Link>
      <Link
        to="/wallet"
        onClick={toggleDropdown}
        className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
      >
        Wallet
      </Link>
      <Link
        to="/orders"
        onClick={toggleDropdown}
        className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
      >
        Orders
      </Link>
      <Link
        to="/logout"
        onClick={handleLogout}
        className="px-4 py-2 text-gray-700 hover:bg-gray-100 transition duration-300"
      >
        Logout
      </Link>
    </div>
  );
};

export default Dropdown;
