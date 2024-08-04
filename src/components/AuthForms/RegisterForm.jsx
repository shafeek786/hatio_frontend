import React, { useEffect, useState } from "react";
import { register } from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RegisterForm = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });

  // Custom hook to handle authentication context
  const { isAuthenticated } = useAuth();
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
      // Call register API
      await register(formData);

      // Display success toast
      toast.success("Registration successful!");

      // Redirect to home page after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error(error);

      // Determine error message
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Registration failed!";

      // Display error toast
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
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
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Mobile"
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RegisterForm;
