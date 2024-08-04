import React, { createContext, useContext, useEffect, useState } from "react";

// Function to parse JWT token and decode payload
const parseJwt = (token) => {
  try {
    // Split the token and decode the payload
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT decoding error:", e);
    return null;
  }
};

// Create a Context for authentication
const AuthContext = createContext(null);

// Custom hook to use authentication context
export const useAuth = () => useContext(AuthContext);

// Provider component for authentication context
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  // Function to check authentication status from token
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    console.log("checkAuth called");
    if (token) {
      try {
        const decoded = parseJwt(token);
        console.log("decoded JWT:", decoded);
        if (decoded) {
          const currentTime = Math.floor(Date.now() / 1000);
          // Check if token is valid and not expired
          if (decoded.exp && decoded.exp > currentTime) {
            setIsAuthenticated(true);
            setUserId(decoded.id);
            setUserName(decoded.username || "");
            console.log("User authenticated:", decoded.id);
          } else {
            // Handle expired token
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setUserId("");
            setUserName("");
            console.log("Token expired");
          }
        } else {
          // Handle invalid token
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUserId("");
          setUserName("");
          console.log("Invalid token");
        }
      } catch (error) {
        // Handle token parsing errors
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUserId("");
        setUserName("");
        console.error("Token parsing error:", error);
      }
    } else {
      // Handle case where no token is found
      setIsAuthenticated(false);
      setUserId("");
      setUserName("");
      console.log("No token found");
    }
  };

  // Function to log out and clear authentication state
  const logout = () => {
    try {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUserId("");
      setUserName("");
      console.log("User logged out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Check authentication status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userName,
        logout,
        checkAuth,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
