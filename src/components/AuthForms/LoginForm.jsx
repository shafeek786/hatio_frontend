import React, { useEffect, useState } from "react";
import { login } from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Custom hook to handle authentication context
  const { checkAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to home page if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Handle input changes and update form state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call login API
      const response = await login(formData);

      // Store token in local storage
      localStorage.setItem("token", response.data.access_token);

      // Display success toast
      toast.success("Login successful!");

      // Update authentication status
      checkAuth();
    } catch (error) {
      console.error(error);

      // Determine error message
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Login failed!";

      // Display error toast
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginForm;
